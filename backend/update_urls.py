#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'unimap'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unimap.settings')
django.setup()

from uni.models import Campus, Building

# Complete, valid Google Maps embed URLs
KASSAI_CAMPUS_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11153.581007329129!2d21.626496001346837!3d47.54032636453124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470dc2dfd0b123%3A0x656d27b6e45c9d72!2sDebrecen%2C%20Kassai%20Campus%2C%204028!5e0!3m2!1sen!2shu!4v1765121770292!5m2!1sen!2shu"

IK_BUILDING_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4074936403304!2d21.63398807793118!3d47.54218345032769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470ddcc57b63cf%3A0x8426ebc782bcb06b!2sDebreceni%20Egyetem%20Informatikai%20Kar!5e0!3m2!1sen!2shu!4v1765121875525!5m2!1sen!2shu"

print("Updating Google Maps URLs...")

# Update Campus URLs
for campus in Campus.objects.all():
    if "Kassai Campus" in campus.name:
        campus.maps_url = KASSAI_CAMPUS_URL
        campus.save()
        print(f"Updated Campus: {campus.name}")

# Update Building URLs  
for building in Building.objects.all():
    if "IK Building" in building.name:
        building.maps_url = IK_BUILDING_URL
        building.save()
        print(f"Updated Building: {building.name}")

print("\nUpdated URLs:")
print("Campus URLs:")
for campus in Campus.objects.all():
    print(f'{campus.name}: {campus.maps_url}')

print("\nBuilding URLs:")
for building in Building.objects.all():
    print(f'{building.name}: {building.maps_url}')