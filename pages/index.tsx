import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { getSession, useSession } from "next-auth/react"
import Hero from '../components/Hero'
import Slider from '../components/Slider'
import Viewers from '../components/Viewers'
import MoviesCollection from '../components/MoviesCollection'
import ShowsCollection from '../components/ShowsCollection'
import { Movies } from '../models'
import FooterComponent from '../components/Footer'

const Home: NextPage = ({
  popularMovies,
  popularShows,
  top_ratedMovies,
  top_ratedShows,
  marvel, dc, disney_classics
}:any) => {
  const { data: session } = useSession()
  
  
  
  
  
  return (
    <div>
      <Head>
        <title>Disney+</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header/>
      {!session ? (
        <Hero/>
      ): (
        <main>
          <Slider/>
          <Viewers/>
          <MoviesCollection results={popularMovies} title="Recommended For You"/>
          <ShowsCollection results={popularShows} title="Tv shows"/>
          <MoviesCollection
            results={top_ratedMovies}
            title="Top Rated Movies"
          />
          
          <ShowsCollection results={top_ratedShows.filter((show: Movies)=>show.poster_path !=null)} title="Top Rated Shows" />
          <MoviesCollection results={disney_classics} title="Disney Classics"/>
          <MoviesCollection results={marvel} title="Marvel"/>
          <MoviesCollection results={dc} title="DC Extended Universe"/>
          <FooterComponent/>
        </main>
      )}
    </div>
  )
}

export default Home

export async function getServerSideProps(context:any){
  const session = await getSession(context)

  const [
    popularMoviesRes,
    popularShowsRes,
    top_ratedMoviesRes,
    top_ratedShowsRes,
    marvelRes,
    dcRes, disney_classicsRes
  ] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US&page1`
    ),
    fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`
    ),
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`
    ),
    fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=1`
    ),
    fetch(
      `https://api.themoviedb.org/4/list/12179?page=1&api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc`
    ),
    fetch(
      `https://api.themoviedb.org/4/list/6468?page=1&api_key=${process.env.API_KEY}&sort_by=vote_average.desc`
    ),
    fetch(
      `https://api.themoviedb.org/4/list/338?page=1&api_key=${process.env.API_KEY}&sort_by=vote_average.desc`
    ),
  ]);

  const [popularMovies, popularShows, top_ratedMovies, top_ratedShows, marvel, dc, disney_classics] =
    await Promise.all([
      popularMoviesRes.json(),
      popularShowsRes.json(),
      top_ratedMoviesRes.json(),
      top_ratedShowsRes.json(),
      marvelRes.json(),
      dcRes.json(),
      disney_classicsRes.json()
    ]);

  return {
    props: {
      session,
      popularMovies: popularMovies.results,
      popularShows: popularShows.results,
      top_ratedMovies: top_ratedMovies.results,
      top_ratedShows: top_ratedShows.results,
      marvel : marvel.results,
      dc: dc.results,
      disney_classics: disney_classics.results
    },
  };
}