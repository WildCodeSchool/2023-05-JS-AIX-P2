import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {useDispatch} from 'react-redux';
import {newMuseumsRecordsAPI, newGardensRecordsAPI, mixeRecords} from '../features/museum/recordsAPISlice';
import RangeBar from "./RangeBar";
import Weather from "./Weather";
import WeatherForecast from "./WeatherForecast";

const SearchBar = ({ setLoading, perimeter, setPerimeter, center }) => {
  const dispatch = useDispatch();
  const [toggleWeather, setToggleWeather] = useState(false);
  const urlBasicMuseums = "https://data.culture.gouv.fr/api/records/1.0/search/?dataset=musees-de-france-base-museofile";
  const urlBasicGardens = "https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-jardins-remarquables";

  const fetchMusee = async (url, reducerDispatch) => {
    const returnFetch = await fetch(url);
    const fetchjson = await returnFetch.json();
    dispatch(reducerDispatch(fetchjson));
  };

  useEffect(() => {
    setLoading(true);

    const firstFetchMixed = async () => {
      await fetchMusee(
        urlBasicMuseums+"&q=ville_m=Marseille", 
        newMuseumsRecordsAPI);
      await fetchMusee(
        urlBasicGardens+"&q=commune=Marseille", 
        newGardensRecordsAPI);

      dispatch(mixeRecords());
    }
    
    firstFetchMixed();

    setLoading(false);
  }, []);

  useEffect(() => {
    (async() => {
      await fetchMusee(urlBasicMuseums+`&geofilter.distance=${center.lat},${center.lng},${perimeter}`, newMuseumsRecordsAPI);
    })();
  }, [perimeter]);

  return (
    <SearchBarWrapper>
      <FiltersWrapper>
        <RangeBar perimeter={perimeter} setPerimeter={setPerimeter} />
        <Weather toggleWeather={toggleWeather} setToggleWeather={setToggleWeather} />
      </FiltersWrapper>
      <div style={toggleWeather ? {display: "block"} : {display: "none"}}>
        <WeatherForecast />
      </div> 
    </SearchBarWrapper>
  );
};

export default SearchBar;
const SearchBarWrapper = styled.div`
  z-index: 1001;
  position: absolute;
  top: 10px;
  left: 60%;
  display: flex;
  flex-direction: column;
  /* background-color: white; */
`;
const FiltersWrapper = styled.div`
  display: flex;
  margin: 10px 0;
`;
