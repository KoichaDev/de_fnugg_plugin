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
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const { search } = attributes;

    const fetchAPI = async (url) => {
      try {
        const res = await fetch(url);
        return await res.json();
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      fetchAPI(
        `https://api.fnugg.no/search?q=${query}&sourceFields=name,description,lifts.count,lifts.open`
      )
        .then((res) => {
          const dataHits = res.hits.hits;
          const idData = [...dataHits].map((id) => id._id);

          const [id] = idData;
          console.log(dataHits);

          fetchAPI(`https://api.fnugg.no/get/resort/${id}`)
            .then((res) => {
              setData(res._source);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }, [query]); // Use to filter query

    const onChangeQuery = (search) => {
      setQuery(search);
    };

    return (
      <div className={className}>
        <RichText onChange={onChangeQuery} value={search} />
      </div>
    );
  },
  save: ({ attributes }) => {
    const { search } = attributes;
    return <RichText.Content tagName="p" value={search} />;
  },
});
