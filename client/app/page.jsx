
// This is a server component, it fetches data and SSR's it.
// It passes data into another SRC <PoolList />
import PoolList from './components/PoolList';
// import { gql } from '@apollo/client';
// import { getClient } from './apollo/client';

// export const revalidate = 1;

// const POOL_QUERY = gql`
//     query Pools {
//         pools {
//             id
//             name
//             season
//             league
//             region
//             owner {
//                 id
//                 fn
//                 ln
//             }
//             entries {
//                 id
//                 user {
//                     id
//                     fn
//                     ln
//                 }
//                 goals
//                 net_goals
//                 own_goals
//                 players {
//                     avatar
//                     fn
//                     ln
//                     goals
//                     net_goals
//                     own_goals
//                 }
//             }
//         }
//     }
// `;

export default async function Home() {
    // const { data } = await getClient().query({ query: POOL_QUERY });

    return (
        <main>
            <PoolList  />
            {/* <PoolList /> */}
        </main>
    );
}
