# vrikshcrafts RAG Knowledge Base

This is the authoritative public-information source for the vrikshcrafts website assistant. The chatbot indexes every block enclosed by `RAG-CHUNK` markers. Information outside those markers is guidance for editors and is not indexed.

Last reviewed: 19 September 2026
Business: vrikshcrafts
Primary market: B2B wood decor and small wooden fixtures
Base: Saharanpur, India

## How to add or update information

Edit this file: `knowledge/vrikshcrafts-rag-knowledge-base.md`.

1. Update an existing chunk when correcting or expanding the same topic.
2. Add a new chunk for a genuinely new product, service, policy, or frequently asked question.
3. Give every new chunk a unique lowercase `id` using hyphens.
4. Keep each chunk focused on one topic and understandable on its own.
5. Add likely customer search words to `keywords`, including common alternatives.
6. Use a real website path in `url`, such as `/catalog`, `/services`, `/about`, or `/contact`.
7. Add only approved public facts. Never add credentials, private customer data, supplier-confidential information, or internal costs.
8. Do not promise an exact price, stock level, material, delivery date, warranty, certification, or capacity unless it has been formally approved and published.
9. Restart the development server after editing this file. The retriever builds its search index when the server starts.

Copy this template immediately above the final “Editor checklist” section:

```md
<!-- RAG-CHUNK
id: unique-topic-id
title: Short customer-facing title
url: /relevant-page
keywords: keyword one, keyword two, alternative phrase
-->
## Short customer-facing title

Write one or two factual, self-contained paragraphs. State what vrikshcrafts offers, who it is for, and any important limitation or next step.
<!-- /RAG-CHUNK -->
```

---

<!-- RAG-CHUNK
id: business-overview
title: About vrikshcrafts
url: /about
keywords: about, company, business, saharanpur, b2b, woodcraft, vrikshcrafts
-->
## About vrikshcrafts

vrikshcrafts is a Saharanpur-based wood decor partner focused mainly on business-to-business requirements. It connects selected local workshops with cafés, restaurants, offices, studios, interior designers, and decor or gift stores through a structured, project-first sourcing process.

Instead of operating as a large marketplace with thousands of unrelated listings, vrikshcrafts learns the client’s space, mood, approximate budget, intended use, quantities, and timeline. It then shortlists suitable handcrafted pieces and coordinates production, finishing, quality checks, packing, and delivery.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: founder
title: Founder of vrikshcrafts
url: /about
keywords: founder, owner, atif, atif bin khalid, started, who founded
-->
## Founder of vrikshcrafts

vrikshcrafts was started by Atif Bin Khalid, based in Saharanpur. The business was created to connect local woodcraft workshops with modern café, office, studio, retail, interior-design, and gifting projects. Every enquiry is reviewed personally, with clear communication about what is realistic for the requested space, budget, and timeline.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: saharanpur-craft
title: Why Saharanpur matters
url: /about
keywords: saharanpur, workshop, woodcraft, carving, craftsmanship, artisan, sourcing
-->
## Why Saharanpur matters

Saharanpur is one of India’s important woodcraft hubs and is known for carving, panel work, and small wooden decor. Working within this ecosystem gives B2B buyers access to varied styles and techniques. vrikshcrafts works with a selected group of workshops to combine traditional skills with structured communication, repeatable designs, agreed timelines, and project-wise coordination.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: customers
title: Who vrikshcrafts works with
url: /about
keywords: customer, clients, business, individual, retail, designer, cafe, restaurant, office, studio, store, b2b
-->
## Who vrikshcrafts works with

vrikshcrafts mainly serves cafés and restaurants, offices and workspaces, creative studios, interior designers, architects or contractors sourcing wooden elements, decor and gift stores, corporate gifting buyers, and businesses developing branded spaces.

Individual buyers may be considered when they have a clear decor plan or require multiple coordinated pieces. The primary operating model remains B2B and project-based rather than single-item mass retail.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: service-overview
title: Services offered by vrikshcrafts
url: /services
keywords: service, services, offer, supply, design, drawing, measurement, coordination, custom
-->
## Services offered by vrikshcrafts

The main services are made-to-order B2B wood decor supply, custom wood decor and signage design, and project coordination for the wooden pieces vrikshcrafts supplies. Support can include defining proportions, sizes, finishes, measurements, reference layouts, and simple 2D drawings.

The business focuses on practical wooden elements that fit an existing interior or brand plan. It can work directly with a business owner or alongside the client’s interior designer, architect, or contractor.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: made-to-order-supply
title: Made-to-order B2B wood decor supply
url: /services
keywords: made to order, b2b supply, wholesale, production, quantity, batch, workshop, finished decor
-->
## Made-to-order B2B wood decor supply

vrikshcrafts supplies finished wooden decor produced through selected Saharanpur workshops. Products are made or shortlisted around the project rather than sold as guaranteed off-the-shelf stock. Sizes, finishes, quantities, reference designs, packing requirements, and timelines are agreed before production.

The supply service is suitable for one-location projects as well as repeatable requirements across stores, cafés, offices, or gifting programs, subject to design and workshop feasibility.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: customization
title: Customization and brand matching
url: /services
keywords: customize, customise, custom, brand, logo, moodboard, theme, finish, engraving, stain, size, proportion
-->
## Customization and brand matching

Wood decor can be developed around a brand identity or interior theme. Clients may share a logo, space photographs, moodboards, reference images, drawings, floor plans, or a written description of the desired style. Possible directions shown on the website include natural wood, darker stains, raised letters, engraving, custom proportions, and coordinated finishes.

Final design, dimensions, material choice, finish, quantity, price, and feasibility are confirmed during the project discussion. A reference image is treated as design direction, not as an automatic promise of an exact copy.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: drawings-coordination
title: Drawings, measurements, and project coordination
url: /services
keywords: drawing, 2d drawing, measurement, dimensions, coordinate, architect, designer, contractor, installation
-->
## Drawings, measurements, and project coordination

For projects involving designers or contractors, vrikshcrafts can provide simple 2D drawings, dimensions, and clarifications for the wooden pieces it supplies. The team coordinates sizes and finishes so those pieces fit the larger interior plan.

This support applies to vrikshcrafts-supplied wood decor and small fixtures. It is not a complete architectural, engineering, or interior-design service. Site teams remain responsible for validating site conditions and installation requirements unless a separate written scope says otherwise.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: catalog-overview
title: Product and catalog overview
url: /catalog
keywords: product, products, artifacts, artefacts, offer, catalog, category, decor, range, available, sell
-->
## Product and catalog overview

The public catalog represents example categories rather than a fixed inventory. vrikshcrafts offers made-to-order wooden wall accents and carved panels, tabletop decor, counter fronts and cladding, entrance and reception signage, logo and menu boards, shelves, small fixtures, and giftable decor.

Final designs, dimensions, woods or materials, finishes, quantities, repeatability, pricing, and production schedules are selected and confirmed for each project. Customers should use the catalog to understand capabilities and use cases, then submit an enquiry for a project-specific recommendation.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: wall-decor
title: Wall accents, carved panels, and lattice work
url: /catalog
keywords: wall, wall decor, wall accent, panel, carved panel, lattice, backdrop, feature wall, carving, reception
-->
## Wall accents, carved panels, and lattice work

The wall-decor category includes handcrafted wall pieces, carved panels, lattice work, feature-wall elements, textured wooden compositions, and decorative backdrops. Typical placements include walls near café cash counters, restaurant seating areas, reception backdrops, office corridors, meeting rooms, studios, and branded display areas.

The layout, scale, carving style, finish, mounting approach, and number of panels must be finalized for the specific wall and project.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: tabletop-decor
title: Tabletop and shelf decor
url: /catalog
keywords: table, tabletop, shelf, counter, niche, small decor, display, ornament, cafe decor
-->
## Tabletop and shelf decor

Tabletop decor includes compact wooden pieces designed for tables, shelves, counters, display niches, reception desks, café surfaces, office or studio displays, and retail presentation. These pieces can support coordinated interior styling, small gifting requirements, or decor-store displays.

Exact designs, sizes, finishes, quantities, packaging, and whether an item can be repeated in batches are confirmed before ordering.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: counter-fronts
title: Wooden counter fronts, cladding, and trims
url: /catalog
keywords: counter, bar front, billing counter, cladding, trim, front panel, retail, hospitality, reception desk
-->
## Wooden counter fronts, cladding, and trims

vrikshcrafts can supply wooden cladding, trims, and front panels for billing counters, customer-facing counters, bar fronts, and selected reception surfaces. These elements are developed to coordinate with the overall interior theme and brand direction.

Site measurements, panel divisions, fixing details, finish expectations, and installation responsibility must be agreed for the individual project. vrikshcrafts does not advertise full counter construction as a standard service.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: signage
title: Wooden signage, logo boards, and entrance pieces
url: /catalog
keywords: sign, signage, logo, logo board, name board, nameboard, entrance, menu board, branding, reception sign
-->
## Wooden signage, logo boards, and entrance pieces

Custom signage options include wooden logo boards, business name boards, reception signage, menu boards, branded display pieces, and selected entrance frames or elements. The goal is to carry the client’s visual identity into the physical space using wood-focused design.

Clients should share the approved logo artwork, preferred dimensions, placement photographs, brand colors or finish references, and any lighting or mounting constraints. Final feasibility and installation details are confirmed during the project.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: shelves-small-fixtures
title: Shelves and small wooden fixtures
url: /services
keywords: shelf, shelves, fixture, menu holder, display fixture, small furniture, wooden element
-->
## Shelves and small wooden fixtures

vrikshcrafts can consider shelves, menu holders, display elements, and other small wooden fixtures that support a café, office, studio, reception, or retail concept. These are project-based wooden elements, not a promise of full furniture production or complete interior execution.

The intended load, dimensions, placement, finish, mounting method, quantity, and site responsibility must be discussed before approval.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: giftable-decor
title: Giftable wooden decor and repeatable batches
url: /catalog
keywords: gift, gifting, corporate gift, batch, sku, repeat order, small decor, retail, gift store
-->
## Giftable wooden decor and repeatable batches

Smaller wooden decor items may be produced in batches for decor or gift stores, corporate gifting, client gifts, guest gifts, or internal company events. The website describes this category as retail-friendly and potentially repeatable.

Exact product selection, branding, minimum practical quantity, packaging, sample approval, repeatability, and delivery schedule depend on the chosen item and workshop capacity. These details must be confirmed through an enquiry.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: cafe-restaurant-use
title: Wood decor for cafés and restaurants
url: /
keywords: cafe, café, restaurant, hospitality, seating, cash counter, menu, feature wall
-->
## Wood decor for cafés and restaurants

For cafés and restaurants, suitable vrikshcrafts categories may include feature-wall panels, carved or lattice backdrops, billing-counter fronts, entrance signage, logo boards, menu boards or holders, tabletop decor, shelves, and coordinated small fixtures. The aim is to add warm handcrafted elements without overloading the space.

Recommendations depend on the floor plan, customer flow, brand mood, available wall or counter dimensions, maintenance expectations, budget, and opening timeline.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: office-studio-use
title: Wood decor for offices and studios
url: /
keywords: office, workspace, studio, reception, meeting room, work area, brand decor
-->
## Wood decor for offices and studios

For offices, workspaces, and studios, suitable categories may include reception logo boards, name boards, subtle wall panels, meeting-room wall accents, corridor pieces, shelves, tabletop decor, and branded display elements. Designs can be aligned with the organization’s visual identity and desired professional tone.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: designer-store-use
title: Support for designers and decor or gift stores
url: /about
keywords: interior designer, architect, contractor, decor store, gift store, retailer, sourcing, repeatability
-->
## Support for designers and decor or gift stores

Interior designers and studios can share moodboards, drawings, dimensions, and finish references so vrikshcrafts can map the concept to practical Saharanpur-made pieces. Decor and gift stores can discuss small and mid-sized items that may be reordered in batches according to demand.

Samples, pricing, repeatability, production quantities, packaging, and lead times are coordinated after the requirement is reviewed.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: project-process
title: How a custom project works
url: /services
keywords: process, steps, brief, concept, design, quote, approval, production, delivery, timeline, sample
-->
## How a custom project works

1. Brief: the client shares the business or space type, logo, photographs, desired wooden pieces, quantities, approximate budget, references, location, and preferred timeline.
2. Concept direction: vrikshcrafts suggests suitable categories and possible directions such as natural wood, darker stains, raised letters, engraving, or coordinated wall and signage pieces.
3. Design detailing: selected pieces are developed with agreed sizes, materials, finishes, measurements, and simple drawings where needed.
4. Quote and approval: the client receives project-specific quantities, pricing, lead-time information, and reference visuals. Production begins only after approval under the agreed process.
5. Production and delivery: the selected Saharanpur workshop produces the pieces, vrikshcrafts coordinates basic quality checks and packing, and the order is shipped with relevant final drawings or clarifications.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: quality-communication
title: Quality, workshop selection, and communication
url: /about
keywords: quality, qc, quality check, workshop, finishing, consistent, communication, realistic
-->
## Quality, workshop selection, and communication

vrikshcrafts works with selected Saharanpur workshops rather than presenting every available supplier. The stated approach emphasizes consistent finishing, realistic suggestions, batch-wise or basic quality checks, practical packing, clear communication, and timelines agreed for the project.

Because products are handcrafted and project-specific, any sample standard, acceptable variation, inspection method, replacement condition, or detailed quality requirement should be documented in the project quotation or approval record.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: minimum-order-budget
title: Minimum order, quantities, pricing, and budget
url: /about
keywords: minimum, moq, order, quantity, budget, price, pricing, cost, quote, quotation, lakh
-->
## Minimum order, quantities, pricing, and budget

There is no published fixed minimum order. Projects are generally more practical when they include several decor pieces, a repeatable batch, or a clear budget range. Individual requirements may still be reviewed when there is a coherent project plan.

The website does not publish fixed prices because cost depends on design, dimensions, material, finish, carving or branding detail, quantity, packaging, destination, and timeline. Customers should share an approximate budget in the enquiry. Only a formal project quotation can confirm price, taxes, payment terms, and commercial conditions.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: shipping
title: Packing, shipping, and delivery areas
url: /about
keywords: ship, shipping, delivery, india, international, global, location, packing, transport, saharanpur
-->
## Packing, shipping, and delivery areas

vrikshcrafts is based in Saharanpur and works with clients across India. Packing methods, shipping options, freight responsibility, and delivery timelines depend on the destination, dimensions, fragility, quantity, and order size and are discussed during the enquiry and quotation process.

Select international or global projects may be considered after logistics, documentation, packing, shipping cost, destination requirements, and feasibility are reviewed. The chatbot must not promise delivery to a specific location or provide a fixed delivery date without project confirmation.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: timelines-availability
title: Production timelines, availability, and stock
url: /contact
keywords: lead time, timeline, delivery date, availability, stock, ready stock, urgent, production capacity
-->
## Production timelines, availability, and stock

vrikshcrafts is primarily made-to-order and project-based. The public website does not provide live stock, guaranteed production capacity, or standard lead times. A realistic schedule is supplied after the design, quantity, finish, workshop availability, approval process, packing, and destination are known.

Urgent deadlines should be stated in the enquiry. The chatbot may explain the process but must not promise availability, dispatch, installation, or delivery dates.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: scope-boundary
title: What vrikshcrafts does not provide as a standard service
url: /services
keywords: architect, interior designer, contractor, full interior, construction, installation, scope, limitation, furniture
-->
## What vrikshcrafts does not provide as a standard service

vrikshcrafts focuses on wooden decor and small wooden fixtures. It does not replace an architect, interior designer, structural engineer, or full interior contractor. It supports those teams by coordinating the wooden elements it supplies.

The website does not advertise full building construction, complete turnkey interiors, structural engineering, full furniture manufacturing, or guaranteed on-site installation as standard services. Any work beyond supply and documented coordination must be confirmed in a project-specific written scope.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: unknown-product-details
title: Product details that require confirmation
url: /contact
keywords: wood species, material, finish, color, size, dimensions, warranty, certification, return, replacement, care, maintenance
-->
## Product details that require confirmation

The public website does not list approved wood species, material grades, standard dimensions, finish catalogs, color guarantees, care instructions, warranties, certifications, return policies, replacement policies, installation warranties, or fixed product specifications.

When asked about any of these subjects, the assistant should clearly state that the detail is not published, avoid guessing, and direct the customer to the enquiry form or direct contact for project-specific confirmation.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: reorder-growth
title: Reorders and expanding to new locations
url: /about
keywords: reorder, repeat order, new location, expansion, scale, repeatable, consistency
-->
## Reorders and expanding to new locations

Clients can begin with a coordinated set of pieces for one café, office, studio, or store and later discuss reorders or an extended range as the brand expands. Repeatability depends on the approved design, retained specifications, material and workshop availability, quantities, and timing, so every repeat order is reconfirmed.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: contact
title: Contact and project enquiries
url: /contact
keywords: contact, enquiry, inquiry, email, phone, whatsapp, response, quotation, project details
-->
## Contact and project enquiries

For a quotation or project-specific recommendation, customers should use the enquiry form at `/contact`. Helpful details include the type of business or space, required pieces, quantities, dimensions, logo or brand files, moodboards or reference images, project location, approximate budget, preferred timeline, and any installation constraints.

The usual stated response time is within one to two business days. Reference photographs, Pinterest boards, drawings, floor plans, or moodboards can be shared by email or later in the project conversation.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: direct-contact
title: Direct contact details
url: /contact
keywords: email address, phone number, whatsapp number, call, contact details, reach, atif
-->
## Direct contact details

Email: atifbinkhalid1@gmail.com. Phone and WhatsApp: +91-8218656007. vrikshcrafts is based in Saharanpur, India.

Use the enquiry form for new projects so all essential details are captured together. Email is useful for drawings, moodboards, floor plans, and reference photographs. Phone or WhatsApp is best for quick clarifications once a project is already in progress.
<!-- /RAG-CHUNK -->

<!-- RAG-CHUNK
id: chatbot-answer-policy
title: How the website assistant should answer
url: /contact
keywords: chatbot, answer, assistant, unsure, unknown, quote, promise, reliable
-->
## How the website assistant should answer

The website assistant should answer from approved vrikshcrafts information only. It should be warm, concise, practical, and transparent about uncertainty. It may explain products, services, customer types, project stages, and published contact information.

It must not invent or guarantee prices, discounts, stock, wood species, material specifications, samples, production capacity, delivery dates, shipping cost, installation, warranties, certifications, returns, replacements, or contractual terms. If the knowledge base does not contain a reliable answer, it should say so and direct the visitor to the enquiry form or direct contact.
<!-- /RAG-CHUNK -->

---

## Editor checklist

Before publishing a knowledge change, confirm:

- The information is approved for public disclosure.
- The claim is consistent with the corresponding website page.
- The chunk has a unique `id`, accurate title, valid website URL, and useful keywords.
- The chunk answers one topic without relying on unstated context.
- Project-specific conditions and uncertainties are stated clearly.
- No personal customer data, supplier secrets, credentials, or internal costs are present.
- `npm test` and `npm run build` pass after the edit.
