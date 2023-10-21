'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

export default function PlayerTable({ players }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        function createData(fn, ln, goals, own_goals, net_goals) {
            const name = `${fn} ${ln}`;
            return { name, goals, own_goals, net_goals };
        }

        const rows = [];

        players.forEach((player) => {
            let data = createData(
                player.fn,
                player.ln,
                player.goals,
                player.own_goals,
                player.net_goals
            );
            rows.push(data);
            // console.log(data);
        });
        setRows(rows);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Goals</TableCell>
                        <TableCell align="right">Own Goals</TableCell>
                        <TableCell align="right">Net Goals</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.goals}</TableCell>
                            <TableCell align="right">{row.own_goals}</TableCell>
                            <TableCell align="right">{row.net_goals}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
