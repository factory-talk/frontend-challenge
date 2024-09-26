
type AutocompleteSearchBarProps = {
    children: React.ReactNode
}

const AutocompleteSearchBar = ({ children }: AutocompleteSearchBarProps): JSX.Element => {
  return (
    <div>
     AutocompleteSearchBar
     {children}
    </div>
  )
}

export default AutocompleteSearchBar;