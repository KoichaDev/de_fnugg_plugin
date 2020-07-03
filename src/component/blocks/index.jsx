import axios from 'axios';

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
      }
      fetchItem();
    }, [query]); // Use to filter query

    const onChangeQuery = (search) => {
      setQuery(search);
    };

    const {
      name,
      images: { image_1_1_l, last_updated },
    } = itemData;
    
    console.log(image_1_1_l, last_updated);
    
    return (
      <div className={className}>
        {
        query !== '' ? ( 
        <section class="card">
          <h1>{name}</h1>
          {/* <img src={data.images.image_1_1_l} alt={data.name} /> */}
        </section>) : '' 
        }
       
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
