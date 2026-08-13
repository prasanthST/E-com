import  { useEffect, useState } from 'react'
import {Star} from "lucide-react"
// import { Sparkfun } from '@thesvg/react'

const Rating = ({value=0 , onRatingChange , disable = false , showValue = true }) => {
  const [hover , setHover ]= useState(0);
  const [rating , setRating ] = useState(value);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleClick = (star) => {
    if (disable)
    return;
    setRating(star);
    onRatingChange?.(star);
  }

  return (
   <div className='flex item-center gap-2'>
    {/* star */}
     <div className='flex item-center gap-1'>
      {[1,2,3,4,5,]?.map((star)=>{
        const filled = hover ? star <= hover : star <= rating;
        return <Star key={star} size={18}
        className={`transition-all duration-200 
        ${filled?"fill-amber-400":"text-gray-3"}
        ${disable?"curser-default":"curser-pointer hover:scale-125"}
        `}
        onMouseEnter={()=>!disable && setHover(star)}
        onMouseLeave={()=>!disable && setHover(0)}
        onClick={()=>handleClick(star)}
        />
      })}
    </div> 
    {/* rating */}
    {showValue && <span className='text-xs font-semibold text-gray-500'>{rating}/5</span>}
   </div>
  )
}

export default Rating
