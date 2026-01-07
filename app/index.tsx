import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";


interface Pokemon{
  name:string;
  url:string;
  image:string;
  imageBack?:string;
  types:PokemonType[]; // array of types from PokeminType interface
}

interface PokemonType{
  type:{
    name:string;
    url:string;
  }
}

const colorsByType ={
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
  fairy: "#D685AD"

}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon []>([]);

  console.log(JSON.stringify(pokemons[0],null,2))
  useEffect(()=>{
    //fetch pokemons 
    fetchPokemons()

  },[]);

  async function fetchPokemons(){
    try {
      const response =await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10");
      const data = await response.json();
     
    // fetching more infos about each pokemon
    //promise for multiple requests fetching 
    const detailedPokemons = await Promise.all(
      data.results.map(async (pokemon:Pokemon)=>{
       const res=await fetch(pokemon.url);
       const details =await res.json();
       


      return {
        name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        image: details.sprites.front_default,//image eta xa 
        imageBack: details.sprites.back_default,
        types:details.types,
      }
      })
    )
    // console.log(detailedPokemons);
      setPokemons(detailedPokemons);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    

    <ScrollView
    contentContainerStyle={{
      gap:16,
      padding:16,
    }}
    >
      {/* <View style={styles.HomeContainer}>

      </View> */}
      {/* pokemon card section */}
      {pokemons.map((pokemon:Pokemon)=>(
     <Link 
     key={pokemon.name}
     href={{pathname:"/details",params:{name:pokemon.name}}}
     style={{
          //@ts-ignore
          backgroundColor:colorsByType[pokemon.types[0].type.name] + 30, // + 30 is opacity
          padding:20,
          borderRadius:20,


        }}
     >
        {/* //pokemon card */}
        <View >
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View style={{
            flexDirection:'row',
          }}>
            
           <Image 
            source={{uri: pokemon.image}} 
            style={{width: 150, height: 150}} 
           />
           <Image 
            source={{uri: pokemon.imageBack!}} 
            style={{width: 150, height: 150}} 
           />            

          </View>


        </View>
  </Link>       
      ))}

    </ScrollView>
    
  );
}


const styles =StyleSheet.create({
  name:{
    fontSize:28,
    fontWeight:"bold",
    textAlign:"center"
  },
  type:{
    fontSize:20,
    fontWeight:"bold",
    color:"gray",
    textAlign:"center"
  },  
  HomeContainer:{
    height:250,

    backgroundColor:"gray",
    padding:20,
    borderRadius:20,
    

  }

})