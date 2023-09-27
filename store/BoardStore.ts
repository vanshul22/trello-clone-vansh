import { ID, databases, storage } from '@/appwrite/appwrite';
import { getTodosGroupedByColumn } from '@/libe/getTodosGroupedByColumn';
import uploadImage from '@/libe/uploadImage';
import { Board, Column, Image, Todo, TypedColumn } from '@/typing'
import { create } from 'zustand'

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!;

interface BoardState {
    board: Board
    getBoard: () => void
    setBoardState: (board: Board) => void
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void
    searchString: string
    setSearchString: (searchString: string) => void
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void
    newTaskInput: string
    setNewTaskInput: (input: string) => void
    newTaskType: TypedColumn
    setNewTaskType: (columnId: TypedColumn) => void
    image: File | null
    setImage: (image: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: { columns: new Map<TypedColumn, Column>() },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board) => set({ board }),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, todo.$id, { title: todo.title, status: columnId });
    },
    searchString: '',
    setSearchString: (searchString) => set({ searchString: searchString }),
    deleteTask: async (taskIndex, todo, id) => {
        const newColumn = new Map(get().board.columns);
        // delete todoId from newColumn
        newColumn.get(id)?.todos.splice(taskIndex, 1);
        // Setting state.
        set({ board: { columns: newColumn } });
        // If image then delete image.
        if (todo.image) await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, todo.$id)
    },
    addTask: async (todo, columnId, image) => {
        let file: Image | undefined;

        // If image then upload the image.
        if (image) {
            const fileuploaded = await uploadImage(image);
            // If successful then get uploaded image details.
            if (fileuploaded) file = { bucketId: fileuploaded.bucketId, fileId: fileuploaded.$id };
        }
        // If image then adding image also otherwise no.
        const { $id } = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { title: todo, status: columnId, ...(file && { image: JSON.stringify(file) }) });
        // console.log($id)
        set({ newTaskInput: "" });

        set((state) => {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                $id, $createdAt: new Date().toISOString(), title: todo, status: columnId,
                // Includes image if it exists.
                ...(file && { image: file })
            }
            const column = newColumns.get(columnId);
            if (!column) {
                newColumns.set(columnId, { id: columnId, todos: [newTodo] });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }
            return {
                board: {
                    columns: newColumns
                }
            }
        })
    },
    newTaskInput: "",
    setNewTaskInput: (input) => set({ newTaskInput: input }),
    newTaskType: "todo",
    setNewTaskType: (columnId) => set({ newTaskType: columnId }),
    image: null,
    setImage: (image) => { set({ image: image }) },
}));