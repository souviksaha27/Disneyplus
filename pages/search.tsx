import styled from 'styled-components'
import Header from '../components/Header'
import SearchDisplay from '../components/SearchDisplay'
import Head from "next/head";
import { useEffect, useState } from 'react';
import { Movies } from '../models';
const Search = () => {

    const [enteredSearch, setEnteredSearch] = useState('');
    const [movies, setMovies] = useState<Movies[]>([])
    

    const SearchChangeHandler = (event: any) => {
        setEnteredSearch(event.target.value);
    };

    useEffect(() => {
        const identifier = setTimeout(() => {
          if(enteredSearch.trim().length > 0 )
          fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&query=${enteredSearch}&include_adult=false`)
       .then(res => res.json())
       .then(data => {
                   const FilteredData = data.results.filter( (element: Movies) => element.media_type != "person" && element.poster_path !=null)
                   setMovies(FilteredData)
       })
          
        }, 800);
        if(enteredSearch.trim().length == 0)
        setMovies([]);
        return () => {
          clearTimeout(identifier);
        };
      }, [enteredSearch]);

      
      return (
          <Main>
            <Head>
                <title>Disney+</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <SearchBox>
                <input type="text" placeholder='Search for movie or a tv-show' onChange={SearchChangeHandler} />
            </SearchBox>
            {enteredSearch && <h1>Results for: {enteredSearch}</h1>}
           

            <Wrapper>
            {movies.length > 0 && 
            movies.map((IndividualMovie) => 
            <SearchDisplay key={IndividualMovie.id} movie={IndividualMovie} media={IndividualMovie.media_type}/>)
        }
            </Wrapper>
            
        </Main>

    )
}

export default Search

const Main = styled.div`
    h1
    {
        color: white;
        font-size: 25px;
        font-weight: bold;
        padding-left: 15px;
        padding-top: 25px;

    }
`



const SearchBox = styled.div`
    color: white;
    font-size: 25px;
    font-weight: bold;
    
    
    
    input 
    {
        height: 82px;
        width: 100vw;
        background-color: grey;
        padding-left: 50px;
        outline: none;

    }

    input::placeholder
    {
        color: white;
        font-size: 25px;
        font-weight: bold;
    }
`

const Wrapper = styled.div`
    display: flex;
    /* justify-content: space-around; */
    position: relative;
    margin-left: 20px;
    gap: 15px;
    flex-wrap: wrap;
`
