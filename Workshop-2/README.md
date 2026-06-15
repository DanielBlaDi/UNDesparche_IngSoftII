# Workshop No. 2: Design Artifacts and System Modeling

## Project: UNDesparche
**Course:** Software Engineering II  
**University:** Universidad Nacional de Colombia  
**Semester:** 2026-I

### Team Members:
*   **Erfán Andrés Triana Duque** (Product Owner)
*   **Daniel Estiven Blanco Diaz** (Scrum Master)
*   **Deibyd Santiago Barragán Gaitán** (Development Team)
*   **Víctor Camilo Cañón Castellanos** (Development Team)
*   **John Freddy Moreno Alejo** (Development Team)
*   **Ricardo Andres Sarmiento Gomez** (Development Team)

---

## Folder Content

This directory contains the technical design documentation and system models for the **UNDesparche** platform. The objective of this phase is to define the system's structure and behavior before implementation.

### 1. CRC Cards
**Document:** `Workshop-2-Design.pdf` (Section 1)  
Contains the Class-Responsibility-Collaboration cards for the main entities of the system, including:
*   **Users:** System Administrator, Event Administrator, Implement Administrator, Community User, and External User.
*   **Core Entities:** Event, Implement, Reserve, Subscription, and Audit Logs.

### 2. Mockups for Key Screens
**Document:** `Workshop-2-Design.pdf` (Section 2)  
Includes wireframes and high-fidelity mockups for the following interfaces:
*   Landing page and Login.
*   Event listing and detailed view.
*   Implement inventory and reservation interface.
*   Administrator dashboards (Events, Implements, and System Management).
*   Interactive Campus Map View.

### 3. Business Model Processes
**Document:** `Workshop-2-Design.pdf` (Section 3)  
Provides a **BPMN (Business Process Model and Notation)** diagram documenting the **"Implement borrowing"** core process, detailing the flow from reservation to physical pick-up and potential expiration.

### 4. Architecture Diagram
**Document:** `Workshop-2-Design.pdf` (Section 4)  
Displays the high-level system structure following a layered pattern:
*   **Frontend:** React GUI.
*   **Backend:** Django REST API (Business Logic).
*   **Database:** PostgreSQL.
*   **Integrations:** Firebase (Auth/Storage), Google Maps API, and Resend (Notifications).

### 5. UML Class Diagram
**Document:** `Workshop-2-Design.pdf` (Section 5)  
Presents the technical design of the system's classes, including detailed attributes, methods, and relationships (inheritance, associations).

### 6. Relational Database Model (ERD)
**Document:** `Workshop-2-Design.pdf` (Section 6)  
Shows the **Entity-Relationship Diagram (ERD)** for the relational database schema, including tables, primary/foreign keys, and data types optimized for PostgreSQL.

---

## Delivery Format
As per the workshop guidelines, all artifacts are compiled into a single PDF file named **`Workshop-2-Design.pdf`** located in this folder.

## References
*   Rumbaugh, J., Jacobson, I., & Booch, G. (1999). *The Unified Modeling Language Reference Manual*.
*   Visual Paradigm. *What is BPMN?*
