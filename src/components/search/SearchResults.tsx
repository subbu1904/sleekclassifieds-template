
import { ListingCard } from "./ListingCard";
import { ListingRow } from "./ListingRow";
import { NoResults } from "./NoResults";

interface SearchResultsProps {
  listings: any[];
  viewMode: "grid" | "list";
}

export const SearchResults = ({ listings, viewMode }: SearchResultsProps) => {
  if (listings.length === 0) {
    return <NoResults />;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingRow key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
