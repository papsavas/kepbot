import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "@kepbot/db";

export default async function ResponsesPage() {
  const responses = await db.query.responses.findMany();

  return (
    <section className="flex max-h-[40svh] overflow-auto">
      <Table>
        <TableCaption>Responses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Target</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map(({ id, text, trigger, targetId }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell className="max-w-[40vw] truncate">{text}</TableCell>
              <TableCell>{trigger}</TableCell>
              <TableCell>{targetId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
