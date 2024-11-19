/* eslint-disable react/prop-types */

function SuggestionsList({
  suggestions = [],
  inputValueHighlight,
  resultKey,
  onSuggestionClick,
}) {
  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (
      <span>
        {parts.map((part, index) => {
          return part.toLowerCase() === highlight.toLowerCase() ? (
            <b key={index}>{part}</b>
          ) : (
            part
          );
        })}
      </span>
    );
  };

  return (
    <>
      {suggestions.map((suggestion, index) => {
        const currSuggestion = resultKey ? suggestion[resultKey] : suggestion;
        return (
          <li
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="suggestion-item"
          >
            {getHighlightedText(currSuggestion, inputValueHighlight)}
          </li>
        );
      })}
    </>
  );
}

export default SuggestionsList;
