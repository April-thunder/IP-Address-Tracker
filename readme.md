# IP Address Tracker

A lightweight web application that displays your current IP address location on an interactive map and allows you to search for any valid IPv4 address to see its geographical location, timezone, and ISP information.

![IP Address Tracker Demo](https://via.placeholder.com/800x400?text=IP+Address+Tracker)  
*(Replace with your actual screenshot)*

---

## 🚀 Features

- **Automatic location detection** – shows your own public IP address and location on page load.
- **IP lookup** – enter any valid IPv4 address to see its location on the map.
- **Detailed information** – displays IP, location (city, region, postal code), timezone, and ISP.
- **Interactive map** – powered by Yandex Maps with a custom marker.
- **Responsive design** – works on desktop, tablet, and mobile.
- **User‑friendly notifications** – uses the Fnon library for elegant error messages.

---

## 🛠️ Technologies Used

- **HTML5, CSS3 (Flexbox)**
- **JavaScript (ES6+)**
- **APIs:**
  - [ipapi.co](https://ipapi.co/) – detects current user IP and location (no API key required).
  - [ipify.org](https://www.ipify.org/) – provides location data for any IP address (requires an API key).
  - [Yandex Maps API](https://yandex.com/dev/maps/) – renders interactive maps.
- **Fnon** – for custom alert dialogs.

---

## 📦 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- Internet connection to fetch data from external APIs.
- A (free) API key from [ipify.org](https://www.ipify.org/) to perform IP lookups.

### Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/IP-Address-Tracker.git