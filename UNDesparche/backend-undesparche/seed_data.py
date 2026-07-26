# -*- coding: utf-8 -*-
import django, os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'undesparche.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from django.contrib.auth.models import Group
from users.models import User
from events.models import Event
from datetime import datetime, timedelta
import random

# Delete existing data first (events before users due to PROTECT FK)
Event.objects.all().delete()
User.objects.filter(email__startswith='test').delete()

# Recreate with proper strings
users = [
    ('test6@unal.edu.co',  'Sof\u00eda Herrera',       'CHS', 'ACT', True, False),
    ('test7@unal.edu.co',  'Diego Ram\u00edrez',       'ING', 'ACT', False, False),
    ('test8@unal.edu.co',  'Valentina Ortiz',    'MED', 'ACT', False, False),
    ('test9@unal.edu.co',  'Felipe Castillo',    'ART', 'SAN', True, False),
    ('test10@unal.edu.co', 'Camila Rojas',       'DER', 'ACT', False, False),
    ('test11@unal.edu.co', 'Esteban Pe\u00f1a',  'CIA', 'ACT', False, True),
    ('test12@unal.edu.co', 'Daniela Mora',       'ENF', 'ACT', False, False),
    ('test13@unal.edu.co', 'Mateo Jim\u00e9nez', 'ING', 'ACT', False, False),
    ('test14@unal.edu.co', 'Gabriela Vargas',    'CCS', 'SAN', False, False),
    ('test15@unal.edu.co', 'Javier Luna',        'MVZ', 'ACT', False, False),
]

admin_ev = Group.objects.get(name='Administrador de Eventos')
admin_im = Group.objects.get(name='Administrador de Implementos')

for i, (email, name, fac, status, is_admin_ev, is_admin_im) in enumerate(users):
    user = User.objects.create(
        email=email, name=name, faculty=fac, status=status,
        firebase_uid=f'firebase_test_{i+5}'
    )
    if is_admin_ev:
        user.groups.add(admin_ev)
    if is_admin_im:
        user.groups.add(admin_im)
    print(f'Creado: {name}')

now = datetime.now()
org_ids = list(User.objects.values_list('id', flat=True))

events = [
    ('Conferencia de IA Aplicada',
     'Charla sobre aplicaciones pr\u00e1cticas de inteligencia artificial en la industria y la academia.',
     'Auditorio Le\u00f3n de Greiff', now+timedelta(1,9*3600), now+timedelta(1,12*3600), 'PRO','ACA', True),
    ('Torneo Interfacultades de F\u00fatbol',
     'Partido final del torneo interfacultades. Participan las facultades de Ingenier\u00eda y Medicina.',
     'Estadio Alfonso L\u00f3pez Pumarejo', now+timedelta(2,14*3600), now+timedelta(2,17*3600), 'PRO','DEP', True),
    ('Taller de Fotograf\u00eda Digital',
     'Taller pr\u00e1ctico de fotograf\u00eda con celular. Aprende t\u00e9cnicas profesionales.',
     'Facultad de Artes', now+timedelta(3,10*3600), now+timedelta(3,13*3600), 'PRO','CUL', True),
    ('Feria de Emprendimiento Estudiantil',
     'Muestra de proyectos de emprendimiento de todas las facultades. Habr\u00e1 stands y presentaciones.',
     'Plaza Che', now+timedelta(4,8*3600), now+timedelta(4,16*3600), 'PRO','PAR', True),
    ('Seminario de Derecho Constitucional',
     'Ciclo de conferencias sobre la nueva reforma constitucional. Invitados especiales.',
     'Aula M\u00e1xima de Derecho', now+timedelta(5,9*3600), now+timedelta(5,12*3600), 'PRO','ACA', True),
    ('Concierto de M\u00fasica Colombiana',
     'Concierto en vivo con agrupaciones estudiantiles interpretando ritmos tradicionales colombianos.',
     'Anfiteatro de Ciencias', now+timedelta(8,17*3600), now+timedelta(8,20*3600), 'PRO','CUL', True),
    ('Clase Abierta de Yoga',
     'Sesi\u00f3n de yoga al aire libre para toda la comunidad universitaria.',
     'Jard\u00edn Bot\u00e1nico UNAL', now+timedelta(10,7*3600), now+timedelta(10,8*3600+30*60), 'PRO','DEP', True),
    ('Hackathon UNAL 2026',
     'Competencia de programaci\u00f3n de 24 horas. Equipos de hasta 4 personas.',
     'Facultad de Ingenier\u00eda', now+timedelta(14,8*3600), now+timedelta(15,8*3600), 'PRO','ACA', True),
    ('Asamblea Estudiantil de Artes',
     'Asamblea general de la facultad de artes para el pr\u00f3ximo semestre.',
     'Facultad de Artes', now-timedelta(2,10*3600), now-timedelta(2,13*3600), 'FIN','ASA', True),
    ('Taller de Primeros Auxilios',
     'Taller pr\u00e1ctico de primeros auxilios dictado por la facultad de Medicina.',
     'Facultad de Medicina', now-timedelta(2*3600), now+timedelta(2*3600), 'ECU','ACA', True),
    ('Cine Foro: Documental Ambiental',
     'Proyecci\u00f3n seguida de un debate con expertos.',
     'Biblioteca Central', now+timedelta(12,14*3600), now+timedelta(12,17*3600), 'PRO','CUL', True),
    ('Torneo de Ajedrez Interfacultades',
     'Torneo abierto de ajedrez para toda la comunidad. Sistema suizo a 7 rondas.',
     'Hemisferio Sur', now+timedelta(5,14*3600), now+timedelta(5,18*3600), 'PRO','DEP', False),
]

for name, desc, place, start, end, status, cat, pub in events:
    Event.objects.create(
        name=name, description=desc, published=pub, place=place,
        latitude=round(random.uniform(4.63,4.65),7),
        longitude=round(random.uniform(-74.09,-74.07),7),
        datetime_start=start, datetime_end=end,
        organizer_id=random.choice(org_ids),
        status=status, category=cat,
    )
    print(f'Evento: {name}')

print('\n\u00a1Listo!')
