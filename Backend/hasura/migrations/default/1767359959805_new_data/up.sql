-- 2. INSERT USERS (Password is 'password123')
INSERT INTO public.users (id, email, display_name, password_hash) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@mathu.com', 'Admin User', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'alice@mathu.com', 'Alice Wonderland', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'bob@mathu.com', 'Bob Builder', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'charlie@mathu.com', 'Charlie Chaplin', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'dave@mathu.com', 'Dave Developer', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'eve@mathu.com', 'Eve Explorer', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'frank@mathu.com', 'Frank Founder', '$2b$10$1Bac7ameBqu5JZkbvElQI.9yKyHbEbuoRl1ptYSSv7AV941bfs0C.');

-- 3. INSERT COMMUNITIES (GROUPS)
INSERT INTO public.groups (id, name, description, created_by) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Tech Enthusiasts', 'A community for discussing the latest in technology, gadgets, and software development.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Global Travelers', 'Share your travel stories, tips, and dream destinations with fellow wanderers.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Book Club', 'Create a habit of reading. Discuss monthly picks and hidden gems.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'Fitness Freaks', 'Motivation, workout routines, and nutrition advice for a healthier lifestyle.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'Indie Hackers', 'Building profitable side projects and startups. Share your journey.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 'Music Lovers', 'From classical to rock, discuss your favorite genres and discover new artists.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b17', 'Gamers Unite', 'LFG? Discussing latest releases, esports, and retro gaming.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18', 'Foodies & Chefs', 'Recipes, restaurant reviews, and cooking tips for everyone.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16');

-- 4. INSERT MEMBERSHIPS
-- Add creators as admins
INSERT INTO public.group_members (group_id, user_id, role) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin'), -- Admin -> Tech
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'admin'), -- Alice -> travel
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin'), -- Bob -> Books
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'admin'), -- Charlie -> Fitness
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'admin'), -- Dave -> Indie
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'admin'), -- Alice -> Music
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin'), -- Bob -> Games
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'admin'); -- Eve -> Food

-- Add random members to make groups look lively
INSERT INTO public.group_members (group_id, user_id, role) VALUES
-- Tech Enthusiasts members
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'member'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'member'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'member'),

-- Global Travelers members
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'member'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'member'),

-- Book Club members
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'member'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'member'),

-- Indie Hackers members
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'member'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'member');
