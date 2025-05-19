import { gql, useQuery } from "@apollo/client";

const GET_CONSONANTS = gql`
  query GetConsonants {
    consonants {
      phoneme
      place
      manner
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_CONSONANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Consonants</h1>
      <ul>
        {data.consonants.map((c: any) => (
          <li key={c.phoneme}>
            {c.phoneme} ({c.place}, {c.manner})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
