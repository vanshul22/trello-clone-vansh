"use client"
import { useBoardStore } from '@/store/BoardStore';
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '@/helpers/StricsModeDroppable';
import { Column } from '@/typing';
import Columns from './Column';

const Board = () => {
    const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [state.board, state.getBoard, state.setBoardState, state.updateTodoInDB]);

    useEffect(() => { getBoard() }, [getBoard]);
    // console.log("board", board);

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        // Check if user dragged card outsite of board.
        if (!destination) return;

        // Handle a column drag
        if (type === 'column') {
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(entries);
            setBoardState({ ...board, columns: rearrangedColumns });
        }

        // This step is needed as the indexes are stored as numbers 0,1,2 etc. instead of Id's  with DND library.
        const columns = Array.from(board.columns);
        const startcolindex = columns[Number(source.droppableId)];
        const finishColindex = columns[Number(destination.droppableId)];


        // getting column ids.
        const startCol: Column = { id: startcolindex[0], todos: startcolindex[1].todos }
        const finishCol: Column = { id: finishColindex[0], todos: finishColindex[1].todos }

        // console.log(startCol, finishCol);

        // If tdrag and drop in same position then do nothing.
        if (!startCol || !finishCol) return;
        if (source.index === destination.index && startCol === finishCol) return;

        // creating new copy.
        const newTodos = startCol.todos;

        // removing todo from source column.
        const [todoMoved] = newTodos.splice(source.index, 1);


        if (startCol.id === finishCol.id) {
            // // Same column task drag.
            // adding todo to destination column.
            newTodos.splice(destination.index, 0, todoMoved);
            // Creating new Object
            const newCol = { id: startCol.id, todos: newTodos };
            const newColumn = new Map(board.columns);
            newColumn.set(startCol.id, newCol);
            setBoardState({ ...board, columns: newColumn });
        } else {
            // dragging to the another column.
            // creating new copy.
            const finishTodos = Array.from(finishCol.todos);
            // removing todo from destination column.
            finishTodos.splice(destination.index, 0, todoMoved);
            // Creating new Object
            const newCol = { id: startCol.id, todos: newTodos };
            const newColumn = new Map(board.columns);
            newColumn.set(startCol.id, newCol);
            newColumn.set(finishCol.id, { id: finishCol.id, todos: finishTodos });
            // Update in Db.
            updateTodoInDB(todoMoved, finishCol.id);
            setBoardState({ ...board, columns: newColumn });
        }




    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="board" direction='horizontal' type='column'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'>
                        {Array.from(board.columns.entries()).map(([id, column], index) => <Columns key={id} id={id} todos={column.todos} index={index} />)}
                        {provided.placeholder}
                    </div>)}
            </Droppable>
        </DragDropContext>
    )
}

export default Board;