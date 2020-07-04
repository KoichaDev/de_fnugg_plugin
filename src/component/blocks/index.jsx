import ky from "ky";

import "./index.css";

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.editor;
const { useState, useEffect } = wp.element;
const { Autocomplete } = wp.components;

registerBlockType("dekode/api-fnugg", {
  title: __("Dekode API Fnugg", "dekode_theme"),
  description: __(
    "Based on the response from the API for the selected resort insert a block in the post content that presents the data fields displayed",
    "dekode_theme"
  ),
  category: "layout",
  icon: {
    background: "#f03",
    foreground: "#fff",
    src: "admin-network",
  },
  keywords: [__("dekode", "dekode_theme"), "fnugg", "dekode_theme"],
  attributes: {
    search: {
      type: "string",
      source: "html",
      selector: "p",
    },
  },
  edit: ({ attributes, setAttributes, className }) => {
    const [data, setData] = useState(null);
    const [query, setQuery] = useState("");
    const { search } = attributes;

    const DeFnuggAutocomplete = () => {};

    useEffect(() => {
      const fetchItem = async () => {
        const { hits } = await ky.get(`https://api.fnugg.no/search?q=${query}`).json();
        const items = hits.hits.map((item) => item._source);
        setData(items);
      };
      fetchItem();
    }, [query]); // Filter the query

    const onChangeQuery = (search) => {
      setQuery(search);
    };

    // Checking the loading from the API call
    if (data === null) {
      return <div>Loading...</div>;
    }

    return (
      <div className={className}>
        {query !== ""
          ? data.map((item) => {
              const {
                conditions: {
                  combined: {
                    top: {
                      condition_description,
                      symbol,
                      temperature,
                      wind
                    }
                  },
                  forecast: { long_term },
                },
                name,
                images: { image_1_1_l },
                last_updated,
              } = item;
              
              // const { symbol = {}, temperature = {}, wind = {} } = long_term[long_term.length - 1] ?? {};
              // console.log(item);
              
              return (
                <section class={`${className}-card`}>
                  <h5 class={`${className}-card__title`}>{name}</h5>
                  <img src={image_1_1_l} alt={name[0]} />
                  <div className={`${className}-card__overlay__sub__title`}>
                    <h4>Dagens Forhold</h4>
                    <p>Oppdatert: {last_updated[0]} </p>
                  </div>

                  <div className={`${className}-card--grid`}>
                    <div class="cloud">
                      <img
                        src="https://image.flaticon.com/icons/svg/899/899718.svg"
                        alt="de_fnugg_cloudy"
                      />
                      <h5>{symbol.name}</h5>
                    </div>
                    <div class="degree">
                      <h1>{temperature.value} °</h1>
                    </div>
                    <div class="wind">
                      <div className="wind__row__1">
                        <img src="https://svgshare.com/i/Mb6.svg" alt="sidj" />
                        <h3>{wind.mps}</h3>
                        <h5>m/s</h5>
                      </div>
                      <p>{wind.speed}</p>
                    </div>
                    <div class="description">
                      <img
                        src="https://i.ibb.co/9TZSzz0/road.png"
                        alt="road"
                        border="0"
                      />
                      <p>{condition_description}</p>
                    </div>
                  </div>
                </section>
              );
            })
          : ""}

        <RichText
          onChange={onChangeQuery}
          value={search}
          placeholder="Search an resort..."
        />
      </div>
    );
  },
  save: ({ attributes }) => {
    const { search } = attributes;
    return <RichText.Content tagName="p" value={search} />;
  },
});
