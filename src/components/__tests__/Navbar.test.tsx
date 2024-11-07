
import { render, screen,fireEvent ,waitFor  } from '@testing-library/react';
import Navbar from 'src/components/Navbar';
import { useRouter } from 'next/navigation';


// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          features: [
            {
              properties: { short_code: "th" },
              place_name: "Bangkok, Thailand",
            },
          ],
        }),
    } as Response)
  );

(useRouter as jest.Mock).mockReturnValue({
  push: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
});

describe('Navbar', () => {
  it('renders the logo text', () => {
    render(<Navbar />);
    const logoElement = screen.getByText(/LOGO/i);
    expect(logoElement).toBeInTheDocument();
  });



  it('renders search input', () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText(/Search city or Zip/i);
    expect(searchInput).toBeInTheDocument();
  });


  it('updates searchTerm on input change', () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText(/Search city or Zip/i);
    fireEvent.change(searchInput, { target: { value: 'Bangkok' } });
    expect(searchInput).toHaveValue('Bangkok');
  });



  it("adds city to favorites when clicked on + icon", async () => {
    render(<Navbar />);
    
     fireEvent.change(screen.getByPlaceholderText(/Search city or Zip/i), {
      target: { value: "Bangkok" },
    });

     await waitFor(() => expect(screen.getByText(/Bangkok, Thailand/i)).toBeInTheDocument());

     fireEvent.click(screen.getByTestId("add-favorite-icon"));

    const storedFavorites = JSON.parse(localStorage.getItem("favoriteCities") || "[]");
    expect(storedFavorites.some((city: string) => city.includes("Bangkok"))).toBe(true);
  });


});


