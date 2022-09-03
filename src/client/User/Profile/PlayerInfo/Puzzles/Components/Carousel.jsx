import React, { useState, useRef, lazy } from 'react';
import axios from 'axios';
import { Virtual, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import 'swiper/css/virtual';
import "swiper/css/navigation";
import "../../../styles/puzzle.css"
import Puzzle from './DisplayPuzzles';

export default function Carousel({ puzzles, options }) {

    let renderPuzzles = puzzles.map((p, i) => {

        return <SwiperSlide
                 key={p._id} 
                 virtualIndex={i} 
                 >
                    <Puzzle
                        key={p._id}
                        puzzleId={p._id}
                        puzzleName={p.puzzleName}
                        image={p.image}
                        addedBy={p.addedBy} 
                        numOfPlayersPlayed={p.numOfPlayersPlayed}
                    />
            </SwiperSlide>
    })

    return (
        <Swiper
             modules={[ Virtual, Navigation, Autoplay ]}
             slidesPerView={4}
             spaceBetween={40}
             autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
             watchSlidesProgress={true}
             navigation
             virtual
            >
                {renderPuzzles}
            </Swiper>
    )
}