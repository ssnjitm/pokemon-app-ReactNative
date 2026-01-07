import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Details() {
  const params = useLocalSearchParams();
  const pokemonName = (params.name as string).toLowerCase();

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemonByName() {
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonByName();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          headerStyle: {
            backgroundColor: colorsByType[mainType],
          },
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colorsByType[mainType] + "30" },
        ]}
      >
        {/* Images */}
        <View style={styles.imageRow}>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
          <Image
            source={{ uri: pokemon.sprites.back_default }}
            style={styles.image}
          />
        </View>

        {/* Types */}
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <Text key={t.type.name} style={styles.type}>
              {t.type.name.toUpperCase()}
            </Text>
          ))}
        </View>

        {/* Info */}
        <Text style={styles.info}>Height: {pokemon.height}</Text>
        <Text style={styles.info}>Weight: {pokemon.weight}</Text>

        {/* Stats */}
        <Text style={styles.statsTitle}>Stats</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text>{s.stat.name}</Text>
            <Text>{s.base_stat}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  types: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  type: {
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    fontSize: 18,
    textAlign: "center",
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
