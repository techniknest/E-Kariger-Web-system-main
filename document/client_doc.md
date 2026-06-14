# E-Karigar Client Dashboard Documentation

## Overview
The Client Dashboard serves as the central command center for users (clients) on the E-Karigar platform. It provides a comprehensive, real-time view of their active service requests, past bookings, and account preferences. The dashboard is designed with a modern, responsive UI focused on clear status visibility and immediate actionability.

## Navigation & Layout
The dashboard employs a sidebar navigation (collapsible on mobile devices) and a top header containing user profile and notification access.

**Sidebar Menu Links:**
- **My Dashboard (`/client/dashboard`)**: The main overview of active tasks and immediate alerts.
- **Past Bookings (`/client/history`)**: A historical record of completed, rejected, or cancelled services.
- **Preferences (`/client/settings`)**: Account management and user settings.
- **Exit to Home (`/`)**: Quick navigation back to the public service listing.

**Top Header:**
- **Notifications**: Real-time alerts for booking status updates, price revisions, and messages.
- **Profile Summary**: Quick view of user avatar, name, and role.

---

## Core Features & Functionalities

### 1. Active Bookings Management
The primary view of the dashboard displays all active jobs. The system categorizes active jobs into four main states:
- **`PENDING`**: The request has been sent to the vendor and is awaiting their acceptance.
- **`ACCEPTED`**: The vendor has agreed to the job.
- **`IN_PROGRESS`**: The vendor has arrived, verified the Start Code, and is actively working.
- **`WAITING_APPROVAL`**: The vendor has requested a price revision after inspecting the issue.

#### Security Feature: The Start Code (OTP)
When a booking enters the `ACCEPTED` state, the dashboard generates and clearly displays a secure 4-digit **Start Code**. 
* **Flow**: The client must physically share this code with the vendor upon their arrival. The vendor enters this code into their app to transition the job to `IN_PROGRESS`. This prevents vendors from starting jobs remotely or bypassing arrival verification (preventing "Ghost Revisions").

#### Dynamic Price Revision Handling
If a vendor encounters unexpected issues on-site, they can request a price revision (putting the job into `WAITING_APPROVAL`).
* **Flow**: The dashboard displays a prominent alert showing the **New Price** and the **Vendor's Reason** for the change.
* **Client Action**: The client can either:
  1. **Approve New Price**: Updates the contract and resumes the job (`IN_PROGRESS`).
  2. **Cancel Job**: Rejects the revision, terminating the booking immediately.

### 2. Rating & Review System
Once a job transitions to `COMPLETED`, the dashboard immediately prompts the client for feedback.
* **Flow**: An interactive "Rate Now" button appears on the completed job card. Clicking it opens a `ReviewModal` where the client can provide a 1-5 star rating and written feedback.
* Once rated, the card updates to permanently display the given rating.

### 3. Vendor Onboarding Pathway
For clients who wish to offer their own services, the dashboard includes a beautifully designed "Growth Opportunity" module.
* **Flow**: Standard clients see a prominent Call-to-Action to "Launch Professional Profile".
* **Status Tracking**: If the client applies to become a vendor, the dashboard dynamically replaces the CTA with real-time application status banners (e.g., `Application Pending Review` or `Application Rejected`), keeping them informed without needing to check emails.

### 4. Past Bookings (History)
The `/client/history` page provides an organized ledger of all closed jobs (`COMPLETED`, `REJECTED`, or `CANCELLED`).
* **Features**: Displays service details, vendor information, exact date/time, and the final billed amount.
* **Price Transparency**: If a job had an approved price revision, the history card explicitly shows the original base price struck-through alongside the finalized revised price, ensuring complete billing transparency.

---

## Technical Aspects & State Management

- **Data Fetching & Caching**: The frontend utilizes `@tanstack/react-query` with a 5-second polling interval (`refetchInterval: 5000`) for the dashboard. This ensures the client sees real-time status updates (like a vendor accepting a job or requesting a price change) without needing to manually refresh the page.
- **Component Architecture**: 
  - `DashboardLayout.tsx`: Handles the responsive shell, navigation state, and role-based routing enforcement.
  - `DashboardPage.tsx`: Handles the conditional rendering of active states and CTA banners.
  - `BookingCard`: A highly dynamic sub-component that morphs its UI based on the specific `status` string of the booking object.
- **Security & Authorization**: The `DashboardPage` checks the `user.role` from local storage. If an unauthorized user (like an Admin or Vendor) attempts to access the client view, the layout automatically redirects them to their canonical canonical route (`/admin` or `/vendor/dashboard`).
