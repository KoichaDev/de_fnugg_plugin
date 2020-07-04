import ky from "ky";

import "./index.css";

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.editor;
const { useState, useEffect } = wp.element;

const ResortCard = ({ className, name, condition, image, last_updated }) => (
  <section class={`${className}-card`}>
    <h5 class={`${className}-card__title`}>{name}</h5>
    <img src={image} alt={name} />
    <div className={`${className}-card__overlay__sub__title`}>
      <h4>Dagens Forhold</h4>
      <p>Oppdatert: {last_updated} </p>
    </div>

    <div className={`${className}-card--grid`}>
      <div class="cloud">
        <img
          src="https://image.flaticon.com/icons/svg/899/899718.svg"
          alt="de_fnugg_cloudy"
        />
        <h5>{condition?.symbol?.name}</h5>
      </div>
      <div class="degree">
        <h1>{condition?.temperature?.value} °</h1>
      </div>
      <div class="wind">
        <div className="wind__row__1">
          <img src="https://svgshare.com/i/Mb6.svg" alt="sidj" />
          <h3>{condition?.wind?.mps}</h3>
          <h5>m/s</h5>
        </div>
        <p>{condition?.wind?.speed}</p>
      </div>
      <div class="description">
        <img src="https://i.ibb.co/9TZSzz0/road.png" alt="road" border="0" />
        <p>{condition?.description}</p>
      </div>
    </div>
  </section>
);

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
  keywords: [__("dekode", "dekode_theme"), __("fnugg", "dekode_theme")],
  attributes: {
    name: {
      type: "string",
    },
    condition: {
      type: "object",
    },
    image: {
      type: "string",
    },
    last_updated: {
      type: "string",
    },
    search: {
      type: "string",
    },
  },
  edit: ({ attributes, setAttributes, className }) => {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setLoading] = useState(false);

    const { search } = attributes;

    useEffect(() => {
      const fetchItem = async () => {
        const { hits } = await ky.get(`https://api.fnugg.no/search?q=${query}`).json();
        const items = hits.hits.map((item) => item._source);

        setResults(items); // Store the search matches
        setLoading(false); // Explicitly indicate that we're no longer querying the API
        if (items.length) onSelectResult(items[0]); // Default to selecting the first matching result
      };

      fetchItem();
      setLoading(true); // Explicitly indicate that we're in the process of querying the API
    }, [query]); // Filter the query

    const onSelectResult = (result) => {
      const condition = result.conditions.combined.top;

      setAttributes({
        name: result.name,
        condition: {
          ...condition,
          description: condition.condition_description,
        },
        image: result.images.image_1_1_l,
        last_updated: result.last_updated,
      });
    };

    const onChangeQuery = (search) => {
      setQuery(search);
    };

    // If no resort has been selected and we're currently querying the API, display a loading message
    if (!attributes.name && isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className={className}>
        <ResortCard {...attributes} className={className} />

         <label htmlFor="resort-name">Choose a resort</label>
        <select id="resort-name" onChange={({target: {value}}) => onSelectResult(results[value])}>
          {results.map((item, i) => {
            return <option value={i}>{item.name}</option>;
          })}
        </select>

        <RichText
          onChange={onChangeQuery}
          value={search}
          placeholder="Search an resort..."
        />
      </div>
    );
  },

  // Just dump the rendered card with the selected resort's information to post_content
  save: ({ attributes, className }) => (
    <ResortCard {...attributes} className={className} />
  ),
});
