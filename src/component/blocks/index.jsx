import ky from 'ky';
import ResortCard from './Resortcard.component.jsx';
import DropdownList from './DropdownList.component.jsx';
import './index.style.css';

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.editor;
const { useState, useEffect } = wp.element;

registerBlockType('dekode/api-fnugg', {
  title: __('Dekode API Fnugg', 'dekode_theme'),
  description: __(
    'Based on the response from the API for the selected resort insert a block in the post content that presents the data fields displayed',
    'dekode_theme'
  ),
  category: 'layout',
  icon: {
    background: '#f03',
    foreground: '#fff',
    src: 'admin-network',
  },
  keywords: [__('dekode', 'dekode_theme'), __('fnugg', 'dekode_theme')],
  attributes: {
    name: {
      type: 'string',
    },
    condition: {
      type: 'object',
    },
    image: {
      type: 'string',
    },
    last_updated: {
      type: 'string',
    },
  },
  edit: ({ attributes, setAttributes, className }) => {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
      const fetchItem = async () => {
        const { hits } = await ky.get(`https://api.fnugg.no/search?q=${query}`).json();
        const items = hits.hits.map((item) => item._source);

        setResults(items); // Store the search matches
        setLoading(false); // Explicitly indicate that we're no longer querying the API
        if (items.length) onSelectResult(items[0]); // Default to selecting the first matching result
      };

      setLoading(true); // Explicitly indicate that we're in the process of querying the API
      fetchItem();
    }, [query]); // Filter the query

    const onSelectResult = (result) => {
      const condition = result.conditions.combined.top;
      const description = result.conditions.condition_description;

      setAttributes({
        name: result.name,
        condition: {
          ...condition,
          ...description,
        },
        image: result.images.image_full,
        last_updated: result.last_updated,
      });
    };

    // If no resort has been selected and we're currently querying the API, display a loading message
    if (!attributes.name && isLoading) {
      return <div>Loading...</div>;
    }
    console.log(results);
    return (
      <div className={className}>
        <ResortCard {...attributes} className={className} />

        <DropdownList array={results} className={className} onChange={onSelectResult} />

        <RichText
          className={`${className}-editor`}
          onChange={setQuery}
          placeholder='Search an resort...'
        />
      </div>
    );
  },

  // Just dump the rendered card with the selected resort's information to post_content
  save: ({ attributes, className }) => <ResortCard {...attributes} className={className} />,
});
