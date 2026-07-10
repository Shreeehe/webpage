#!/usr/bin/env python3
import os
import re

# List of 16 neighborhoods with slugs, names, landmarks, and description suffixes
locations = [
    {
        "name": "Whitefield",
        "slug": "whitefield",
        "landmarks": "Hope Farm Junction, ITPL, Kadugodi, Varthur, Nallurhalli, and Brookefield",
        "desc_suffix": "serving ITPL and surrounding tech hubs."
    },
    {
        "name": "Sarjapur Road",
        "slug": "sarjapur-road",
        "landmarks": "Kaikondrahalli, Carmelaram, Sompura, Doddakannelli, Kasavanahalli, and Bellandur Gate",
        "desc_suffix": "serving families along the outer corridor."
    },
    {
        "name": "HSR Layout",
        "slug": "hsr-layout",
        "landmarks": "Sectors 1 to 7, Agara, Silk Board, Kudlu Gate, and Teacher's Colony",
        "desc_suffix": "providing premium healthcare across all sectors."
    },
    {
        "name": "Indiranagar",
        "slug": "indiranagar",
        "landmarks": "100 Feet Road, Double Road, Defence Colony, Halasuru, Jeevan Bheema Nagar, and Domlur",
        "desc_suffix": "offering reliable post-hospital care in the heart of East Bangalore."
    },
    {
        "name": "Koramangala",
        "slug": "koramangala",
        "landmarks": "Blocks 1 to 8, Sony World Junction, St. John's, SG Palya, and Madivala",
        "desc_suffix": "bringing top-tier care to this prominent residential and commercial area."
    },
    {
        "name": "Bellandur",
        "slug": "bellandur",
        "landmarks": "Green Glen Layout, Iblur, Outer Ring Road, Devarabeesanahalli, and Yamalur",
        "desc_suffix": "supporting active tech communities and residential societies."
    },
    {
        "name": "Electronic City",
        "slug": "electronic-city",
        "landmarks": "Phase 1, Phase 2, Singasandra, Veerasandra, Konappana Agrahara, and Hebbagodi",
        "desc_suffix": "serving South Bangalore's major electronics and IT hub."
    },
    {
        "name": "Hebbal",
        "slug": "hebbal",
        "landmarks": "Manyata Tech Park, RT Nagar, Kempapura, Ganganagar, and Hebbal Kempapura",
        "desc_suffix": "providing home nursing near the North Bangalore gateway."
    },
    {
        "name": "Yelahanka",
        "slug": "yelahanka",
        "landmarks": "Yelahanka New Town, Old Town, Doddaballapur Road, Kogilu, and Jakkur",
        "desc_suffix": "delivering compassionate elder care in North Bangalore."
    },
    {
        "name": "Thanisandra",
        "slug": "thanisandra",
        "landmarks": "Bhartiya City, Hegde Nagar, Thanisandra Main Road, and Chokkanahalli",
        "desc_suffix": "serving the growing residential communities along Thanisandra Road."
    },
    {
        "name": "Kanakapura Road",
        "slug": "kanakapura-road",
        "landmarks": "Banashankari, ISKCON Vaikuntha, Konanakunte, Yelachenahalli, and Kaggalipura",
        "desc_suffix": "offering nursing and senior care along the Kanakapura highway corridor."
    },
    {
        "name": "Bannerghatta Road",
        "slug": "bannerghatta-road",
        "landmarks": "Bilekahalli, Hulimavu, Gottigere, JP Nagar Phase 8, Arakere, and Meenakshi Temple area",
        "desc_suffix": "delivering nursing support along South Bangalore's major medical zone."
    },
    {
        "name": "Jayanagar",
        "slug": "jayanagar",
        "landmarks": "Blocks 1 to 9, Ashoka Pillar, South End Circle, Jayanagar 4th Block, and Tilak Nagar",
        "desc_suffix": "bringing premium geriatric and home care to South Bangalore's historic suburb."
    },
    {
        "name": "JP Nagar",
        "slug": "jp-nagar",
        "landmarks": "Phases 1 to 8, Sarakki, Rose Garden, Puttenahalli, and Dollar's Colony",
        "desc_suffix": "providing trusted nursing assistants and elder care in JP Nagar."
    },
    {
        "name": "Malleshwaram",
        "slug": "malleshwaram",
        "landmarks": "Margosa Road, Sampige Road, Sadashivanagar, Vyalikaval, and Yeswanthpur",
        "desc_suffix": "offering professional elderly care and nursing services in West Bangalore."
    },
    {
        "name": "Hennur",
        "slug": "hennur",
        "landmarks": "Hennur Gardens, HRBR Layout, Kalyan Nagar, Horamavu, and Babusapalya",
        "desc_suffix": "supporting families with verified home nurses in the Hennur area."
    },
    {
        "name": "Chandapura",
        "slug": "chandapura",
        "landmarks": "Chandapura Circle, Alliance University, Suryanagar, and Anekal Road",
        "desc_suffix": "bringing verified home care to South Bangalore's growing residential hubs."
    },
    {
        "name": "Bommasandra",
        "slug": "bommasandra",
        "landmarks": "Bommasandra Industrial Area, Yarandahalli, Hennagara, and Jigani Link Road",
        "desc_suffix": "offering professional home nursing near the industrial and residential belt."
    },
    {
        "name": "Attibele",
        "slug": "attibele",
        "landmarks": "Attibele Toll Plaza, guest line area, Mayasandra, and Bidaraguppe",
        "desc_suffix": "delivering quality home care support near the border corridor."
    },
    {
        "name": "Hebbagodi",
        "slug": "hebbagodi",
        "landmarks": "Hebbagodi Metro Station, Kammasandra, Ananth Nagar, and Huskur Gate",
        "desc_suffix": "providing trusted bedside caregivers and nursing services in Hebbagodi."
    }
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "index.html")
LOCATIONS_DIR = os.path.join(BASE_DIR, "locations")
SITEMAP_PATH = os.path.join(BASE_DIR, "sitemap.xml")

def generate_location_pages():
    # Read index.html content
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        template = f.read()

    # Create locations/ directory if it doesn't exist
    if not os.path.exists(LOCATIONS_DIR):
        os.makedirs(LOCATIONS_DIR)
        print(f"Created locations directory: {LOCATIONS_DIR}")

    # Generate each location page
    for loc in locations:
        name = loc["name"]
        slug = loc["slug"]
        landmarks = loc["landmarks"]
        desc_suffix = loc["desc_suffix"]

        # Customize page content
        content = template

        # 1. Update title and canonical/meta URLs
        content = content.replace(
            "<title>Best Home Care in Bangalore | Nursing, Elder & Bedridden Care at Home</title>",
            f"<title>Best Home Nursing & Elder Care in {name}, Bangalore | Aksraya</title>"
        )
        content = content.replace(
            'href="https://aksrayahealthcare.com/"',
            f'href="https://aksrayahealthcare.com/locations/{slug}.html"'
        )
        content = content.replace(
            'content="https://aksrayahealthcare.com/"',
            f'content="https://aksrayahealthcare.com/locations/{slug}.html"'
        )

        # 2. Update descriptions (Regex to handle potential spacing/newlines)
        desc_pattern = r'<meta name="description"\s+content="Looking for the best home care in Bangalore\? Aksraya provides trusted nursing care, elder care, and bedridden patient care at home with 12hrs and 24hrs support\.">'
        desc_replacement = f'<meta name="description" content="Looking for trusted home nursing, elder care, or bedridden patient care in {name}, Bangalore? Aksraya provides 12hrs and 24hrs registered care {desc_suffix}">'
        content = re.sub(desc_pattern, desc_replacement, content)

        # 3. Update social tags
        content = content.replace(
            '<meta property="og:title" content="Best Home Care in Bangalore | Aksraya Health Care">',
            f'<meta property="og:title" content="Best Home Care & Nursing in {name} | Aksraya Health Care">'
        )
        content = content.replace(
            '<meta name="twitter:title" content="Best Home Care in Bangalore | Aksraya Health Care">',
            f'<meta name="twitter:title" content="Best Home Care & Nursing in {name} | Aksraya Health Care">'
        )

        og_desc_pattern = r'<meta property="og:description"\s+content="Trusted nursing care, elder care, and bedridden patient care at home in Bangalore\. 12hrs and 24hrs support with trained caregivers\.">'
        og_desc_replacement = f'<meta property="og:description" content="Trusted nursing care, elder care, and bedridden patient care in {name}, Bangalore. 12hrs and 24hrs support with verified caretakers and nurses.">'
        content = re.sub(og_desc_pattern, og_desc_replacement, content)

        tw_desc_pattern = r'<meta name="twitter:description"\s+content="Trusted nursing care, elder care, and bedridden patient care at home in Bangalore with 12hrs and 24hrs support\.">'
        tw_desc_replacement = f'<meta name="twitter:description" content="Trusted nursing care, elder care, and bedridden patient care at home in {name}, Bangalore with 12hrs and 24hrs support.">'
        content = re.sub(tw_desc_pattern, tw_desc_replacement, content)

        # 4. Update tagline & main subtitle in Hero
        content = content.replace(
            "<span>Available across Bangalore</span>",
            f"<span>Now Serving {name}, Bangalore</span>"
        )
        content = content.replace(
            '<p class="subtitle subtitle-dark">Trusted nursing care, elder care, and bedridden patient care at home in Bangalore. Reliable 12hrs and 24hrs support that adapts to your needs.</p>',
            f'<p class="subtitle subtitle-dark">Trusted nursing care, elder care, and bedridden patient care at home in <strong>{name}, Bangalore</strong>. Reliable 12hrs and 24hrs support that adapts to your needs.</p>'
        )

        # 5. Customize the FAQ to make it location-specific
        faq_target = '<div class="faq-question" role="button" tabindex="0" aria-expanded="false">What areas do you cover in Bangalore?</div>\n                        <div class="faq-answer" role="region">We provide registered home nursing services across Bangalore. We have localized branches and care coordinators serving key neighborhoods including <a href="/locations/whitefield.html">Whitefield</a>, <a href="/locations/sarjapur-road.html">Sarjapur Road</a>, <a href="/locations/hsr-layout.html">HSR Layout</a>, <a href="/locations/indiranagar.html">Indiranagar</a>, <a href="/locations/koramangala.html">Koramangala</a>, <a href="/locations/bellandur.html">Bellandur</a>, <a href="/locations/electronic-city.html">Electronic City</a>, <a href="/locations/hebbal.html">Hebbal</a>, <a href="/locations/yelahanka.html">Yelahanka</a>, <a href="/locations/thanisandra.html">Thanisandra</a>, <a href="/locations/kanakapura-road.html">Kanakapura Road</a>, <a href="/locations/bannerghatta-road.html">Bannerghatta Road</a>, <a href="/locations/jayanagar.html">Jayanagar</a>, <a href="/locations/jp-nagar.html">JP Nagar</a>, <a href="/locations/malleshwaram.html">Malleshwaram</a>, <a href="/locations/hennur.html">Hennur</a>, <a href="/locations/chandapura.html">Chandapura</a>, <a href="/locations/bommasandra.html">Bommasandra</a>, <a href="/locations/attibele.html">Attibele</a>, and <a href="/locations/hebbagodi.html">Hebbagodi</a>. If you are outside these areas, please contact us as we are constantly expanding.</div>'
        faq_replacement = f'<div class="faq-question" role="button" tabindex="0" aria-expanded="false">Do you provide home nursing services in {name}?</div>\n                        <div class="faq-answer" role="region">Yes, Aksraya provides fully registered home nursing, elder care, and bedridden patient care services at home in {name}. We cover all parts of {name} including {landmarks}. Our localized team of verified nurses and caregivers ensures rapid setup and consistent backup support.</div>'
        content = content.replace(faq_target, faq_replacement)

        # 6. Customize Schema structured data
        content = content.replace(
            '"addressLocality": "Bangalore"',
            f'"addressLocality": "{name}, Bangalore"'
        )
        content = content.replace(
            '"name": "Bangalore"\n        }',
            f'"name": "{name}, Bangalore"\n        }}'
        )
        # Update structured data FAQ
        schema_faq_target = '"name": "What areas do you cover in Bangalore?",\n                "acceptedAnswer": {\n                    "@type": "Answer",\n                    "text": "We provide registered home nursing services across Bangalore and surrounding areas. Contact us to confirm if we serve your specific location. We are continuously expanding our coverage."'
        schema_faq_replacement = f'"name": "Do you provide home nursing services in {name}?",\n                "acceptedAnswer": {{\n                    "@type": "Answer",\n                    "text": "Yes, Aksraya provides registered home nursing, elder care, and bedridden care at home in {name}. We serve all parts of {name} including {landmarks}. Our localized team ensures that a verified nurse or caretaker can reach your home promptly."\n                }}'
        content = content.replace(schema_faq_target, schema_faq_replacement)

        # 7. Update relative paths for assets & files to point to parent folder (../)
        content = content.replace('href="css/', 'href="../css/')
        content = content.replace('src="js/', 'src="../js/')
        content = content.replace('href="assets/', 'href="../assets/')
        content = content.replace('src="assets/', 'src="../assets/')
        content = content.replace('href="careers.html"', 'href="../careers.html"')
        content = content.replace('href="privacy-policy.html"', 'href="../privacy-policy.html"')
        content = content.replace('href="terms.html"', 'href="../terms.html"')

        # 8. Write the file
        output_file = os.path.join(LOCATIONS_DIR, f"{slug}.html")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Generated location page: locations/{slug}.html")

def update_sitemap():
    # Read sitemap.xml content
    with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
        sitemap = f.read()

    # Generate sitemap entries for locations
    entries = []
    for loc in locations:
        slug = loc["slug"]
        url = f"https://aksrayahealthcare.com/locations/{slug}.html"
        # Check if URL already in sitemap
        if url not in sitemap:
            entry = f"""    <url>
        <loc>{url}</loc>
        <lastmod>2026-07-10</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>"""
            entries.append(entry)

    if entries:
        # Insert entries before </urlset>
        new_entries = "\n\n" + "\n\n".join(entries) + "\n"
        sitemap = sitemap.replace("</urlset>", f"{new_entries}</urlset>")
        with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
            f.write(sitemap)
        print(f"Added {len(entries)} location pages to sitemap.xml")
    else:
        print("All locations already exist in sitemap.xml")

if __name__ == "__main__":
    generate_location_pages()
    update_sitemap()
    print("SEO Local Pages Generation Complete!")
