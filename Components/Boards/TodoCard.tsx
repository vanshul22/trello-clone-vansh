"use client"
import getURL from "@/lib/getURL";
import { useBoardStore } from "@/store/BoardStore";
import { Todo, TypedColumn } from "@/typing";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";

type Props = {
    todo: Todo,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void,
    draggableProps: DraggableProvidedDraggableProps,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

const TodoCard = ({ todo, index, id, innerRef, draggableProps, dragHandleProps }: Props) => {
    const deleteTask = useBoardStore((state) => state.deleteTask);
    const [imageURL, setImageURL] = useState<string | null>(null);

    const fetchImage = async () => {
        // Fetching image from db.
        const url = await getURL(todo.image!);
        if (url) { setImageURL(url.toString()) }
    }

    useEffect(() => {
        if (todo.image) {
            fetchImage();
        }
    }, [todo]);

    return (
        <div {...draggableProps} {...dragHandleProps} ref={innerRef} className="bg-white rounded-md space-y-2 drop-shadow-md">
            <div className="flex justify-between items-center p-5">
                <p className="">{todo.title}</p>
                <button onClick={() => deleteTask(index, todo, id)} className="text-red-500 hover:text-red-600"><XCircleIcon className="ml-5 h-8 w-8 " /></button>
            </div>
            {/* Add image */}
            {imageURL && (
                <div className="h-full w-full rounded-b-md">
                    <Image src={imageURL} alt="Task image" width={400} height={200} className="w-full object-contain rounded-b-md" />
                </div>
            )}
        </div>
    )
}

export default TodoCard;