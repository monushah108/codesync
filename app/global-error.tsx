"use client";

import "./globals.css";

export default function GlobalError({}) {
  <html lang="en" className="dark">
    <body>
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>Try again</button>
    </body>
  </html>;
}
