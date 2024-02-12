import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table';

import Image from 'next/image';
import {
    Description,
    Field,
    FieldGroup,
    Fieldset,
    Label,
    Legend,
} from '../fieldset';
import { Input } from '../input';
import { Select } from '../select';
import { Text } from '../text';
import { Textarea } from '../textarea';
import { Badge } from '../badge';
import { Strong, TextLink } from '../text';
import { Avatar } from '../avatar';

type User = {
    name: string;
    email: string;
    status: string;
    handle: string;
    avatarUrl: string;
    net_goals: number;
};

const users: User[] = [
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'A',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'B',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'C',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'D',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'E',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
    {
        name: 'Mike',
        email: 'Mike@mike.com',
        status: 'admin',
        handle: 'F',
        avatarUrl: 'public/mh.png',
        net_goals: 21,
    },
];

export default function UserTable() {
    return (
        <>
            <h1 className="text-2xl font-semibold">Pool Manager</h1>
            <Fieldset>
                <FieldGroup>
                    <Field>
                        <div className="flex items-center justify-between">
                            <Description>
                                Select from all of the pools that you organize.
                            </Description>
                            <Select className="w-1/4" name="country">
                                <option>Canada</option>
                                <option>UK</option>
                            </Select>
                        </div>
                    </Field>
                </FieldGroup>

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
                            <>
                                <TableRow key={user.handle}>
                                    <TableCell>
                                        <Avatar 
                                            className="size-8 pb-10"
                                            src="mh.png"
                                            
                                        />
                                        {/* fix this so the avatar circle doesn't stretch to fit image */}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>
                                        {user.net_goals}
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        <Badge color="purple">NO</Badge>
                                        {/* {user.status} */}
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        <Badge color="lime">ACTIVE</Badge>
                                        {/* {user.status} */}
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </Fieldset>
        </>
    );
}
