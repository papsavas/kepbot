import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getUserResponses } from "@kepbot/db/responses";
import { getAuthenticatedUser } from "~/auth";

export default async function ResponsesPage() {
  const { userId } = await getAuthenticatedUser();
  const responses = await getUserResponses({ userId });

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
