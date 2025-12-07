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

print("Campus URLs:")
for campus in Campus.objects.all():
    print(f'{campus.name}: {campus.maps_url}')

print("\nBuilding URLs:")
for building in Building.objects.all():
    print(f'{building.name}: {building.maps_url}')