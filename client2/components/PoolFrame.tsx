import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './UI/table';

import { Description, Field, FieldGroup, Fieldset } from './UI/fieldset';

import { Select } from './UI/select';
import { Badge } from './UI/badge';
import { Avatar } from './UI/avatar';

import users from '../test/testdata';

export default function PoolFrame() {
    return (
        <>
            <h1 className="text-2xl font-semibold">Pool Manager</h1>
            <Fieldset>
                <FieldGroup>
                    <Field>
                        <div className="flex items-center justify-between">
                            <Description className="w-1/2">
                                Select from all of the pools that you organize.
                            </Description>
                            <Select className="w-1/4" name="country">
                                <option>Canada</option>
                                <option>UK</option>
                            </Select>
                        </div>
                    </Field>
                </FieldGroup>
            </Fieldset>

            <Table className="py-10 px-1 mx-auto">
                <TableHead>
                    <TableRow>
                        <TableHeader>Avatar</TableHeader>
                        <TableHeader>User</TableHeader>
                        <TableHeader>Total Goals</TableHeader>
                        <TableHeader>All 4 Scored?</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.handle}>
                            <TableCell>
                                <Avatar className="size-8 pb-10" src="mh.png" />
                                {/* fix this so the avatar circle doesn't stretch to fit image */}
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.name}
                            </TableCell>
                            <TableCell>{user.net_goals}</TableCell>
                            <TableCell className="text-zinc-500">
                                <Badge color="purple">YES</Badge>
                            </TableCell>
                            <TableCell className="text-zinc-500">
                                {user.status === 'ACTIVE' ? (
                                    <Badge color="lime">{user.status}</Badge>
                                ) : (
                                    <Badge color="red">{user.status}</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
