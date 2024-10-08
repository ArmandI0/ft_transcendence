# Generated by Django 5.1.2 on 2024-10-09 17:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('tournament_id', models.AutoField(primary_key=True, serialize=False)),
                ('game_type', models.CharField(choices=[('RollandGapong', 'RollandGapong'), ('Cyberpong', 'Cyberpong'), ('card', 'Card')], max_length=20)),
                ('date', models.DateTimeField()),
            ],
            options={
                'db_table': 'tournament',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='PongGameResult',
            fields=[
                ('game_id', models.AutoField(primary_key=True, serialize=False)),
                ('player2', models.CharField(max_length=200)),
                ('score_player1', models.CharField(max_length=10)),
                ('score_player2', models.CharField(max_length=10)),
                ('game', models.CharField(choices=[('RollandGapong', 'RollandGapong'), ('Cyberpong', 'Cyberpong')], default='pong', max_length=20)),
                ('game_duration', models.TimeField()),
                ('date', models.DateTimeField()),
                ('tournament_phase', models.CharField(blank=True, max_length=10, null=True)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('tournament_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.tournament')),
            ],
            options={
                'db_table': 'pong_result',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='CardGameResult',
            fields=[
                ('game_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('game_duration', models.TimeField()),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('tournament_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.tournament')),
            ],
            options={
                'db_table': 'card_result',
                'ordering': ['-date'],
            },
        ),
    ]
