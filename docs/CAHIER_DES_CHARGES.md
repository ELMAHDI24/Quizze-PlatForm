# QuizMaster — Cahier des Charges (Mise à jour)

## 1. Objectifs

Plateforme de gestion et de passage de quiz éducatifs en ligne.

- **Affectation directe et nominative** des étudiants aux évaluations par l'enseignant.
- ~~Code d'accès unique~~ **(supprimé)**

## 2. Acteurs

### Acteur 1 — Enseignant
- Crée et configure des quiz (durée, expiration, notation, questions)
- **Affecte directement** une liste d'étudiants à chaque évaluation
- Consulte les résultats et sessions des étudiants

### Acteur 2 — Étudiant
- Accède **directement** à la liste des quiz qui lui sont assignés (tableau de bord)
- **Aucune saisie de code** requise
- Passe les quiz une question à la fois

---

## 3. Spécifications Fonctionnelles

### 3.1 Enseignant
- Créer un quiz avec titre, description (éditeur riche), durée totale (minutes)
- Définir une **date d'expiration** (`expires_at`)
- Choisir le **système de notation** : Standard ou Canadien
- Générer en masse **N questions vides** d'un seul coup
- **Affecter nominativement** une liste d'étudiants
- ~~Génération de code d'accès~~ **(supprimé)**

### 3.2 Étudiant
- Sélectionne son quiz depuis son **tableau de bord** (cartes)
- Questions affichées **une par une** (navigation unidirectionnelle)
- Chaque réponse sauvegardée **instantanément à la volée** en base (`Student_Response`)
- Timer synchronisé avec le serveur
- Reprise de session à la dernière question non validée

---

## 4. Règles de Gestion

| ID | Règle |
|----|-------|
| RG-05 | L'étudiant ne peut accéder qu'aux quiz auxquels il a été **explicitement affecté** |
| RG-07 | **Reprise de session sécurisée** : en cas de déconnexion, reprise à la dernière question non validée. Recommencer depuis le début est bloqué |
| RG-08 | **Navigation unidirectionnelle** : retour en arrière interdit (bouton « Précédent » supprimé) |
| RG-09 | **Gestion du temps** : clôture automatique de la session à la fin du temps imparti |
| RG-10 | **Automatisation du statut** : passage Actif → Terminé selon `expires_at` |
| RG-11 | **Système Canadien** : points négatifs (pénalités) pour les mauvaises réponses |
| RG-12 | **Validation de contenu** : publication bloquée si toutes les questions générées ne sont pas entièrement remplies |

> ~~RG-04 (unicité du code d'accès)~~ **supprimée**

---

## 5. Modélisation et Base de Données

### 5.1 Tables

#### Table `Quiz`
| Attribut | Type | Notes |
|----------|------|-------|
| id | PK | |
| title | String | |
| description | Text | |
| duration_minutes | Integer | **nouveau** |
| expires_at | DateTime | **nouveau** |
| grading_system | Enum(standard, canadien) | **nouveau** |
| status | Enum | Actif, Brouillon, Terminé, Expiré |
| teacher_id | FK | |
| ~~access_code~~ | — | **supprimé** |

#### Table `Question`
| Attribut | Type | Notes |
|----------|------|-------|
| id | PK | |
| quiz_id | FK | |
| text | Text | |
| points | Float | **nouveau** |
| penalty_points | Float | **nouveau** |

#### Table `Quiz_Assignment` *(nouvelle)*
| Attribut | Type |
|----------|------|
| id | PK |
| quiz_id | FK → Quiz |
| user_id | FK → User |

#### Table `Quiz_Session` *(remplace Result)*
| Attribut | Type |
|----------|------|
| id | PK |
| user_id | FK → User |
| quiz_id | FK → Quiz |
| started_at | DateTime |
| current_question_id | FK → Question (nullable) |
| status | Enum(en_cours, termine) |
| score | Float |

#### Table `Student_Response` *(nouvelle)*
| Attribut | Type |
|----------|------|
| id | PK |
| session_id | FK → Quiz_Session |
| question_id | FK → Question |
| answer_id | FK → Choice |
| answered_at | DateTime |

> ~~Table `Result`~~ **supprimée**

### 5.2 Relations Clés
- `Quiz` 1—N `Question`
- `Quiz` 1—N `Quiz_Assignment` N—1 `User`
- `Quiz` 1—N `Quiz_Session` N—1 `User`
- `Quiz_Session` 1—N `Student_Response`
- `Question` 1—N `Student_Response`

---

## 6. Maquettes UI

### 6.2 Création de Quiz
- ~~Champ Code~~ **supprimé**
- Champs : Durée, Date d'expiration, Système de notation, Nombre de questions à générer
- Interface de sélection/affectation des étudiants (modale)

### 6.3 Espace Étudiant
- **Accueil** : quiz assignés sous forme de **cartes** (pas de saisie de code)
- **Passage** : Timer + bouton « Valider et continuer » uniquement (pas de « Précédent »)

---

## 7. Périmètre Technique

### 7.2 Périmètre fonctionnel
- ~~Système de code d'accès~~ → **Système d'affectation d'étudiants**
- Shadcn/ui, Radix Switch, React Hook Form, TipTap (éditeur riche), Tailwind `grayscale`

---

*Document généré pour intégration backend — Salah Eddine*
