import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import dishLogo from "../../assets/dish_wordmark.jpg";
import userIcon from "../../assets/user_icon.jpg";

describe("Header Component", () => {
  test("renders header title", () => {
    render(<Header />);
    const titleElement = screen.getByText(/Custom Tagging Interface/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the logo image with correct src and alt text", () => {
    render(<Header />);
    const logoElement = screen.getByAltText("dish_logo");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute("src", dishLogo);
  });

  test("renders the user icon with correct src and alt text", () => {
    render(<Header />);
    const userIconElement = screen.getByAltText("user_icon");
    expect(userIconElement).toBeInTheDocument();
    expect(userIconElement).toHaveAttribute("src", userIcon);
  });
});
