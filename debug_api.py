import urllib.request
import json
import urllib.error

API_URL = "http://127.0.0.1:8000/api"

def check_url(url):
    try:
        with urllib.request.urlopen(url) as response:
            return response.getcode(), response.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        return 0, str(e)

print(f"Checking API at {API_URL}")

# 1. Fetch all categories
print("\nFetching /categories/ ...")
code, body = check_url(f"{API_URL}/categories/")
print(f"Status: {code}")

if code != 200:
    print("Failed to fetch list.")
    exit(1)

categories = json.loads(body)
print(f"Found {len(categories)} categories.")

# 2. Check each category detail
for cat in categories:
    name = cat.get('name')
    slug = cat.get('slug')
    print(f"\nChecking Category: '{name}' (slug: '{slug}')")
    
    cat_code, cat_body = check_url(f"{API_URL}/categories/{slug}/")
    if cat_code == 200:
        print(f"  OK (200)")
        # Check children if any
        children = cat.get('children', [])
        for child in children:
            c_slug = child.get('slug')
            print(f"  Checking Child: '{child.get('name')}' (slug: '{c_slug}')")
            child_code, child_body = check_url(f"{API_URL}/categories/{c_slug}/")
            if child_code != 200:
                 print(f"    FAILED: {child_code}")
                 print(f"    Body: {child_body[:200]}...") # Print first 200 chars
            else:
                 print(f"    OK")

    else:
        print(f"  FAILED: {cat_code}")
        print(f"  Body: {cat_body}")
