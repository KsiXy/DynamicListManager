/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import SuggestionsList from "./suggestionList";
import debounce from "lodash/debounce";

const Autocomplete = ({
  placeholder = "",
  staticData,
  fetchSuggestions,
  resultKey = "",
  customLoading = "...Loading",
  onSelect = () => {},
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  customStyles = {},
}) => {
  const [inputValue, setinputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(suggestions);

  const handleInputChange = (event) => {
    setinputValue(event.target.value);
    onChange(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setinputValue(resultKey ? suggestion[resultKey] : resultKey);
    onSelect(suggestion);
    setSuggestions([]);
  };

  const getSuggestions = async (query) => {
    setError(null);
    setLoading(true);

    try {
      let result;
      if (staticData) {
        result = staticData.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase());
        });
      } else if (fetchSuggestions) {
        result = await fetchSuggestions(query);
      }
      setSuggestions(result);
    } catch (err) {
      setError(err.message);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsDebounce = useCallback(debounce(getSuggestions, 300), []);

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionsDebounce(inputValue);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="container">
      <input
        type="text"
        style={customStyles}
        value={inputValue}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
      />
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">{customLoading}</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          <SuggestionsList
            resultKey={resultKey}
            inputValueHighlight={inputValue}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
