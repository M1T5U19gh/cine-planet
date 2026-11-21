CREATE DATABASE IF NOT EXISTS cineplanet;
USE cineplanet;
CREATE TABLE IF NOT EXISTS filmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL UNIQUE,
  generos VARCHAR(200) NOT NULL,
  duracao VARCHAR(40) NOT NULL,
  sinopse TEXT NOT NULL,
  imagem VARCHAR(255),
  ano SMALLINT,
  diretor VARCHAR(200),
  classificacao VARCHAR(20)
);

INSERT IGNORE INTO filmes (titulo, generos, duracao, sinopse, imagem, ano, diretor, classificacao) VALUES
('The Batman', 'Ação · Crime · Drama', '2h 56min', 'Batman investiga uma série de assassinatos cometidos pelo Charada e descobre uma rede de corrupção que envolve figuras importantes de Gotham City.', '/assets/images/filmes/the-batman.jpg', 2022, 'Matt Reeves', 'PG-13'),
('Clube da Luta', 'Drama · Suspense', '2h 19min', 'Um homem insone conhece Tyler Durden e passa a participar de encontros clandestinos de luta que se transformam em um movimento perigoso.', '/assets/images/filmes/clube-da-luta.jpg', 1999, 'David Fincher', 'R'),
('Garota, Interrompida', 'Drama · Biografia', '2h 7min', 'Após uma crise emocional, Susanna é internada em uma instituição psiquiátrica e cria vínculos intensos com outras pacientes.', '/assets/images/filmes/garota-interrompida.jpg', 1999, 'James Mangold', 'R'),
('Stay', 'Drama · Mistério · Suspense', '1h 39min', 'Um psiquiatra tenta ajudar um jovem paciente que afirma que irá morrer em três dias, enquanto a realidade ao seu redor começa a se desfazer.', '/assets/images/filmes/stay.jpg', 2005, 'Marc Forster', 'R'),
('Pulp Fiction', 'Crime · Drama', '2h 34min', 'Criminosos, assassinos e personagens do submundo se cruzam em histórias violentas apresentadas fora de ordem.', '/assets/images/filmes/pulp-fiction.jpg', 1994, 'Quentin Tarantino', 'R'),
('Taxi Driver', 'Drama · Crime', '1h 54min', 'Um veterano solitário trabalha como taxista em Nova York e se perde em pensamentos violentos sobre a cidade.', '/assets/images/filmes/taxi-driver.jpg', 1976, 'Martin Scorsese', 'R'),
('Homem-Aranha 2', 'Ação · Aventura', '2h 7min', 'Peter Parker enfrenta dificuldades pessoais enquanto um cientista transformado pelo acidente se torna o Doutor Octopus.', '/assets/images/filmes/homem-aranha-2.jpg', 2004, 'Sam Raimi', 'PG-13'),
('Dagon', 'Terror · Fantasia', '1h 38min', 'Após naufragar em uma vila isolada, um homem descobre moradores envolvidos em antigos rituais sobrenaturais.', '/assets/images/filmes/dagon.jpg', 2001, 'Stuart Gordon', NULL),
('Duro de Matar 4.0', 'Ação · Suspense', '2h 9min', 'John McClane se une a um jovem hacker para impedir um ataque cibernético à infraestrutura dos Estados Unidos.', '/assets/images/filmes/duro-de-matar-4.jpg', 2007, 'Len Wiseman', 'PG-13'),
('Max Payne', 'Ação · Mistério', '1h 40min', 'Um policial marcado pela tragédia investiga uma conspiração ligada ao assassinato de sua família.', '/assets/images/filmes/max-payne.jpg', 2008, 'John Moore', 'PG-13'),
('Nostalghia', 'Drama', '2h 5min', 'Um poeta russo viaja à Itália para estudar um compositor e desenvolve uma profunda reflexão sobre saudade e pertencimento.', '/assets/images/filmes/nostalghia.jpg', 1983, 'Andrei Tarkovsky', NULL),
('Um Dia de Fúria', 'Drama · Crime · Suspense', '1h 53min', 'Frustrado com a vida e a sociedade, um homem abandona seu carro em Los Angeles e inicia uma jornada cada vez mais violenta.', '/assets/images/filmes/um-dia-de-furia.jpg', 1993, 'Joel Schumacher', 'R'),
('Clube dos Cinco', 'Comédia · Drama', '1h 37min', 'Cinco adolescentes diferentes cumprem uma detenção escolar e descobrem afinidades inesperadas.', '/assets/images/filmes/clube-dos-cinco.jpg', 1985, 'John Hughes', 'R');
