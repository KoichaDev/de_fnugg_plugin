import React from 'react';

const ResortCard = ({ className, name, condition, image, last_updated }) => (
  <div class={`${className}-card`}>
    <h5 class={`${className}-card__title`}>{name}</h5>

    <img src={image} alt={name} />
    <div className={`${className}-card__overlay__sub__title`}>
      <h4>Dagens Forhold</h4>
      <p>Oppdatert: {last_updated} </p>
    </div>

    <div className={`${className}-card--grid`}>
      <div class='cloud'>
        <img src='https://image.flaticon.com/icons/svg/899/899718.svg' alt='de_fnugg_cloudy' />
        <h5>{condition?.symbol?.name}</h5>
      </div>
      <div class='degree'>
        <h1>{condition?.temperature?.value} °</h1>
      </div>
      <div class='wind'>
        <div className='wind__row__1'>
          <img src='https://svgshare.com/i/Mb6.svg' alt='sidj' />
          <h3>{condition?.wind?.mps}</h3>
          <h5>m/s</h5>
        </div>
        <div className='wind__row__2'>
          <p>{condition?.wind?.speed}</p>
        </div>
      </div>
      <div class='description'>
        <img src='https://i.ibb.co/9TZSzz0/road.png' alt='road' border='0' />
        <p>{condition?.description}</p>
      </div>
    </div>
  </div>
);

export default ResortCard;
