import axios from "axios";
import "./index.css";

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.editor;
const { useState, useEffect } = wp.element;

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
    const [itemData, setItemData] = useState([]);
    const [query, setQuery] = useState("");
    const { search } = attributes;

    useEffect(() => {
      const fetchItem = async () => {
        const result = await axios(`https://api.fnugg.no/search?q=${query}`);
        result.data.hits.hits.map((item) => setItemData(item._source));
      };
      fetchItem();
    }, [query]); // Use to filter query

    const onChangeQuery = (search) => {
      setQuery(search);
    };

    const { name, last_updated } = itemData;

    return (
      <div className={className}>
        {itemData !== "" ? (
          <section class={`${className}-card`}>
            <h5 class={`${className}-card__title`}>{name}</h5>
            <img
              src="https://images.unsplash.com/photo-1593474799424-e6bd1554f956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1226&q=80"
              alt={name}
            />
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
                <h5>Overskyet</h5>
              </div>
              <div class="degree">
                <h1>10 °</h1>
              </div>
              <div class="wind">
                <div className="wind__row__1">
                  <img src="https://svgshare.com/i/Mb6.svg" alt="sidj" />
                  <h2>2.5</h2>
                  <h5>m/s</h5>
                </div>
                <p>Så og si Vindstille</p>
              </div>
              <div class="description">
                <img src="https://i.ibb.co/9TZSzz0/road.png" alt="road" border="0" />
                <p>Deilig Vårsnø</p>
              </div>
            </div>
          </section>
        ) : (
          ""
        )}

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
