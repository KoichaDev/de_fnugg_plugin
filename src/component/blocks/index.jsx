import axios from 'axios';

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.editor;
const {useState, useEffect} = wp.element;

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
    content: {
      type: "string",
      source: "html",
      selector: 'p'
    },
  },
  edit: ({ attributes, setAttributes, className }) => {
    const [data, setData] = useState([]);
    const { content } = attributes;

    const onChangeContent = (content) => {
      useEffect(() => {
        const fetchItem = async () => {
          const result = await axios(`https://api.fnugg.no/search?q=${content}&sourceFields=name,description,lifts.count,lifts.open`);
          setData(result);
        }
        fetchItem();
      }, [content]);
    }

    console.log(data);

    return (
      <div className={className}>
        <RichText onChange={onChangeContent} value={content}/>
      </div>
    );
  },
  save: ({attributes}) => {
       const { content } = attributes;
       return <RichText.Content tagName="p" value={content} />;
  },
});
