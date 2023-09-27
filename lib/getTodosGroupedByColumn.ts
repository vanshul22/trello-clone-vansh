import { databases } from "@/appwrite/appwrite"
import { TypedColumn, Column, Board } from "@/typing";

export const getTodosGroupedByColumn = async () => {
    const data = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!);

    // console.log(data);
    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            // get the image if its exists from response. otherwise done need.
            ...(todo.image && { image: JSON.parse(todo.image) }),
        });

        return acc;
    }, new Map<TypedColumn, Column>());

    // console.log(columns);

    // If column does not have any of these todo, inprogress and done, then adding them with empty todos.
    const columntypes: TypedColumn[] = ["todo", "inprogress", "done"];

    for (const columnType of columntypes) {
        if (!columns.get(columnType)) columns.set(columnType, { id: columnType, todos: [] });
    }

    // Sort columns by order type.
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a, b) => (
            // string check
            columntypes.indexOf(a[0]) - columntypes.indexOf(b[0])
        ))
    );

    const board: Board = {
        columns: sortedColumns
    }

    return board;

}
