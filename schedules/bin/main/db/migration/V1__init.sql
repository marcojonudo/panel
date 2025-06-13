CREATE TABLE employee_data (
  id bigserial NOT NULL,
  version bigint NOT NULL DEFAULT 0,
  code VARCHAR(10),
  name VARCHAR(255),
  surname1 VARCHAR(255),
  surname2 VARCHAR(255),
  job_position_group_code VARCHAR(10),
  PRIMARY KEY (id));

CREATE TABLE schedule_interval (
  id bigserial NOT NULL,
  version bigint NOT NULL DEFAULT 0,
  start TIME NOT NULL,
  "end" TIME NOT NULL,
  PRIMARY KEY (id));

insert into schedule_interval (start, "end") values
('08:30', '15:00');

CREATE TABLE IF NOT EXISTS employee_schedule (
    id bigserial NOT NULL,
    version bigint NOT NULL DEFAULT 0,
    employee_data_id bigint not null,
    day date DEFAULT NULL,
    code varchar(10) not null,
    working_day boolean not null default true,
    rest_minutes int DEFAULT NULL,
    job_position_group_code VARCHAR(10),
    absence_info_id bigint null,
    saved_ifv boolean NOT NULL DEFAULT true,
    date_deleted timestamp,
    PRIMARY KEY (id),
    constraint employee_data_fk foreign key(employee_data_id) references employee_data(id));

insert into employee_data (code, name, surname1, surname2, job_position_group_code) values
('0000001', 'Marco', 'Martínez', 'Ávila', 'GARAGE');

insert into employee_schedule (employee_data_id, day, code, rest_minutes, job_position_group_code) values
((select id from employee_data where code = '0000001'), CURRENT_DATE, '0000001', 10, 'GARAGE'),
((select id from employee_data where code = '0000001'), current_date + INTERVAL '1 day', '0000001', 15, 'GARAGE'),
((select id from employee_data where code = '0000001'), current_date + INTERVAL '2 day', '0000001', 0, 'GARAGE');

CREATE TABLE absence (
  id bigserial NOT NULL,
  version bigint NOT NULL DEFAULT 0,
  code VARCHAR(45) NOT NULL,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (id));

insert into absence (code, description) values
('VAC', 'Vacaciones'),
('CMF', 'Compensación festivos'),
('FOR', 'Formaciones y reuniones'),
('ENF', 'Enfermedad'),
('CEJ', 'Compensación excesos de jornada'),
('PRV', 'Permiso por ENF/ACC/FALL familiar'),
('MED', 'Visita médica'),
('HSC', 'Gestiones sindicales'),
('LRC', 'Licencias reconocidas por homogeneización convenio'),
('ACC', 'Accidente'),
('ANJ', 'Ausencias injustificadas'),
('PAT', 'Paternidad'),
('PRD', 'Asuntos propios debidamente justificados'),
('ADO', 'Alumbramiento esposa'),
('CAS', 'Permisos por matrimonio'),
('MUD', 'Traslado domicilio'),
('HEN', 'Hospitalización'),
('MAT', 'Maternidad'),
('LAC', 'Lactancia'),
('SES', 'Sanción por suspensión de empleo'),
('RIS', 'Riesgo durante el embarazo'),
('HUT', 'Paros y huelgas'),
('EEX', 'Estudios y exámenes'),
('AMP', 'Alta médica sin prestación'),
('PSS', 'Licencias no retribuidas'),
('ERT', 'ERTE');


CREATE TABLE absence_info (
  id bigserial NOT NULL,
  version bigint NOT NULL DEFAULT 0,
--   employee_schedule_id bigint NOT NULL,
  absence_id bigint NOT NULL,
  expected_end_day DATE null,
  CONSTRAINT absence_foreign
    FOREIGN KEY (absence_id)
    REFERENCES absence (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  PRIMARY KEY (id));

-- CREATE INDEX absence_info_employee_schedule_idx on absence_info (employee_schedule_id);


CREATE TABLE employee_schedule_intervals (
  employee_schedule_id bigint NOT NULL,
  interval_id bigint NOT NULL,
  PRIMARY KEY (employee_schedule_id, interval_id),
  CONSTRAINT employee_schedule_fk
    FOREIGN KEY (employee_schedule_id)
    REFERENCES employee_schedule (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT interval_foreign_key
    FOREIGN KEY (interval_id)
    REFERENCES schedule_interval (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX intervals_employee_schedule_idx on employee_schedule_intervals (employee_schedule_id);

insert into employee_schedule_intervals (employee_schedule_id, interval_id) VALUES
((select id from employee_schedule where id = 2), (select id from schedule_interval where id = 1));


CREATE TABLE skill_style (
  id bigserial not null,
  version bigint NOT NULL DEFAULT 0,
  color varchar(7) not NULL,
  background_color VARCHAR(7) NOT NULL,
  PRIMARY KEY (id));

  CREATE INDEX skill_style_idx on skill_style (id);


CREATE TABLE skill_category (
  id bigserial not null,
  version bigint NOT NULL DEFAULT 0,
  code varchar(15) not NULL,
  name varchar(45) not NULL,
  job_position_group_code varchar(20) NOT NULL,
  PRIMARY KEY (id));
  CREATE INDEX skill_category_idx on skill_category (id);

CREATE TABLE skill_code (
  id bigserial not null,
  version bigint NOT NULL DEFAULT 0,
  code varchar(5) not NULL,
  style_id bigint NOT NULL,
  "order" int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT skill_style_fk
    FOREIGN KEY (style_id)
    REFERENCES skill_style (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
  CREATE INDEX skill_code_idx on skill_code (id);

CREATE TABLE skill (
  id bigserial not null,
  version bigint NOT NULL DEFAULT 0,
  parent_id bigint NULL,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(45) NOT NULL,
  code_id bigint NULL,
  expertise_percentage int NULL,
  category_id bigint NOT NULL,
  style_id bigint NOT NULL,
  "order" int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT skill_code_fk
    FOREIGN KEY (code_id)
    REFERENCES skill_code (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT category_fk
    FOREIGN KEY (category_id)
    REFERENCES skill_category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT skill_skill_style_fk
    FOREIGN KEY (style_id)
    REFERENCES skill_style (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
  CREATE INDEX skill_idx on skill (id);

CREATE TABLE skill_employee (
  id bigserial not null,
  version bigint NOT NULL DEFAULT 0,
  skill_code varchar(20) NOT NULL,
  employee_code varchar(45) NOT NULL,
  expertise varchar(45) NOT NULL,
  month date NOT NULL,
  PRIMARY KEY (id));
  CREATE INDEX skill_employee_idx on skill_employee (id);

insert into skill_style (color, background_color) values
('#fff', '#00b050'),
('#fff', '#ff0000'),
('#000', '#ffff00'),
('#000', '#00b0f0'),
('#fff', '#000'),
('#000', '#bf9000'),
('#000', '#c6e0b4'),
('#000', '#e2efda'),
('#000', '#ff7575'),
('#000', '#ffaaa3'),
('#000', '#ffffcc'),
('#000', '#fcffe7'),
('#000', '#b4c6e7'),
('#000', '#ddebf7'),
('#fff', '#595959'),
('#000', '#d9d9d9'),
('#fff', '#305496'),
('#000', '#d6dce4');

insert into skill_category (code, name, job_position_group_code) values
('RAP', 'Rápidas', 'GARAGE'),
('TP', 'Técnico pesado', 'GARAGE'),
('VENTA', 'Venta', 'SHOP'),
('GESTION', 'Gestión', 'SHOP');

insert into skill_code (code, style_id, "order") values
('N', (select id from skill_style where color = '#fff' and background_color = '#00b050'), 0),
('AL', (select id from skill_style where color = '#fff' and background_color = '#ff0000'), 1),
('AC', (select id from skill_style where color = '#000' and background_color = '#ffff00'), 2),
('FR', (select id from skill_style where color = '#000' and background_color = '#00b0f0'), 3),
('A', (select id from skill_style where color = '#fff' and background_color = '#000'), 4),
('AM', (select id from skill_style where color = '#000' and background_color = '#00b0f0'), 5),
('DIS', (select id from skill_style where color = '#000' and background_color = '#00b0f0'), 6),
('TP', (select id from skill_style where color = '#000' and background_color = '#bf9000'), 7);

insert into skill (code, name, code_id, expertise_percentage, category_id, style_id, "order") values
('NEU', 'Neumáticos', (select id from skill_code where code = 'N'), null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#c6e0b4'), 1),
('ALI', 'Alineación', (select id from skill_code where code = 'AL'), null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ff7575'), 2),
('ACE', 'Aceite', (select id from skill_code where code = 'AC'), null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ffffcc'), 3),
('ELEC_BAS', 'Electricidad básica', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#b4c6e7'), 4),
('TEC_LIG', 'Técnico ligero', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#00b0f0'), 5),
('AA', 'AA', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#fff' and background_color = '#595959'), 6),
('TEC_PES', 'Técnico pesado', (select id from skill_code where code = 'TP'), null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#fff' and background_color = '#305496'), 7),
('ELEC_AV', 'Electricidad avanzada', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#fff' and background_color = '#305496'), 8),

('MONT', 'Montaje', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#e2efda'), 1),
('EQU', 'Equilibrados', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#e2efda'), 2),
('PINCH', 'Pinchazos', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#e2efda'), 3),

('CONV', 'Convergencia', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ffaaa3'), 1),
('CAI_AVA', 'Caídas / Avance', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ffaaa3'), 2),

('FIL_AI_HAB', 'Filtro de aire / habitáculo', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#fcffe7'), 1),
('FIL_GG', 'Filtro de gasoil / gasolina', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#fcffe7'), 2),
('OP_MAN', 'Op. mantenimiento', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#fcffe7'), 3),

('BAT', 'Baterías', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 1),
('REG_FAR', 'Reglaje de faros', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 2),
('BUJ_CAL', 'Bujías / calentadores', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 3),
('BOMB', 'Bombillas', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 4),

('PAS_DIS_LIQ', 'Pastillas / discos / líq. frenos', (select id from skill_code where code = 'FR'), null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 1),
('GUARD', 'Guardapolvos', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 2),
('ES_FAP', 'Escapes / FAP', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 3),
('ANTICONG', 'Anticongelante', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 4),
('LIM_INY', 'Limpieza de inyección', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 5),
('PUL_FAR', 'Pulido de faros', null, null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#ddebf7'), 6),

('AIR_ACON', 'Aire acondicionado', (select id from skill_code where code = 'A'), null, (select id from skill_category where code = 'RAP'), (select id from skill_style where color = '#000' and background_color = '#d9d9d9'), 1),

('FREN_TAMB', 'Frenos tambor', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 1),
('AMORT', 'Amortiguadores', (select id from skill_code where code = 'AM'), null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 2),
('DISTRIB', 'Distribuciones', (select id from skill_code where code = 'DIS'), null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 3),
('OTR_OP_PES', 'Otras op. pesadas', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 4),

('ALT_MOT_ARRAN', 'Alternador / motor arranque', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 1),
('DIAG', 'Diagnosis', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 2),
('RAD_ALT', 'Radios / altavoces', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 3),
('ETAP', 'Etapas', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 4),
('MAN_LIB', 'Manos libres', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 5),
('MOD_TELEM', 'Módulos telemáticos', null, null, (select id from skill_category where code = 'TP'), (select id from skill_style where color = '#000' and background_color = '#d6dce4'), 6);


update skill set parent_id = (select id from (select * from skill s) as s where name = 'Neumáticos') where name = 'Montaje';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Neumáticos') where name = 'Equilibrados';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Neumáticos') where name = 'Pinchazos';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Alineación') where name = 'Convergencia';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Alineación') where name = 'Caídas / Avance';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Aceite') where name = 'Filtro de aire / habitáculo';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Aceite') where name = 'Filtro de gasoil / gasolina';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Aceite') where name = 'Op. mantenimiento';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad básica') where name = 'Baterías';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad básica') where name = 'Reglaje de faros';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad básica') where name = 'Bujías / calentadores';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad básica') where name = 'Bombillas';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Pastillas / discos / líq. frenos';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Guardapolvos';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Escapes / FAP';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Anticongelante';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Limpieza de inyección';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico ligero') where name = 'Pulido de faros';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'AA') where name = 'Aire acondicionado';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico pesado') where name = 'Frenos tambor';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico pesado') where name = 'Amortiguadores';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico pesado') where name = 'Distribuciones';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Técnico pesado') where name = 'Otras op. pesadas';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Alternador / motor arranque';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Diagnosis';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Radios / altavoces';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Etapas';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Manos libres';
update skill set parent_id = (select id from (select * from skill s) as s where name = 'Electricidad avanzada') where name = 'Módulos telemáticos';

update skill set expertise_percentage = 100 where name = 'Montaje';
update skill set expertise_percentage = 100 where name = 'Equilibrados';
update skill set expertise_percentage = 100 where name = 'Pinchazos';
update skill set expertise_percentage = 75 where name = 'Convergencia';
update skill set expertise_percentage = 60 where name = 'Caídas / Avance';
update skill set expertise_percentage = 100 where name = 'Filtro de aire / habitáculo';
update skill set expertise_percentage = 60 where name = 'Filtro de gasoil / gasolina';
update skill set expertise_percentage = 80 where name = 'Op. mantenimiento';
update skill set expertise_percentage = 100 where name = 'Baterías';
update skill set expertise_percentage = 100 where name = 'Reglaje de faros';
update skill set expertise_percentage = 60 where name = 'Bujías / calentadores';
update skill set expertise_percentage = 100 where name = 'Bombillas';
update skill set expertise_percentage = 80 where name = 'Pastillas / discos / líq. frenos';
update skill set expertise_percentage = 80 where name = 'Guardapolvos';
update skill set expertise_percentage = 60 where name = 'Escapes / FAP';
update skill set expertise_percentage = 60 where name = 'Anticongelante';
update skill set expertise_percentage = 60 where name = 'Limpieza de inyección';
update skill set expertise_percentage = 60 where name = 'Pulido de faros';
update skill set expertise_percentage = 80 where name = 'Aire acondicionado';
update skill set expertise_percentage = 35 where name = 'Frenos tambor';
update skill set expertise_percentage = 35 where name = 'Amortiguadores';
update skill set expertise_percentage = 35 where name = 'Distribuciones';
update skill set expertise_percentage = 35 where name = 'Otras op. pesadas';
update skill set expertise_percentage = 80 where name = 'Alternador / motor arranque';
update skill set expertise_percentage = 35 where name = 'Diagnosis';
update skill set expertise_percentage = 35 where name = 'Radios / altavoces';
update skill set expertise_percentage = 35 where name = 'Etapas';
update skill set expertise_percentage = 35 where name = 'Manos libres';
update skill set expertise_percentage = 35 where name = 'Módulos telemáticos';


insert into skill_employee (skill_code, employee_code, expertise, "month") values
('NEU', '0000001', 'HIGH', '2022-06-01'),
('ALI', '0000001', 'HIGH', '2022-06-01'),
('ACE', '0000001', 'MEDIUM', '2022-06-01'),
('ELEC_BAS', '0000001', 'HIGH', '2022-06-01'),
('TEC_LIG', '0000001', 'MEDIUM', '2022-06-01'),
('AA', '0000001', 'HIGH', '2022-06-01'),
('TEC_PES', '0000001', 'MEDIUM', '2022-06-01'),
('ELEC_AV', '0000001', 'LOW', '2022-06-01'),
('MONT', '0000001', 'LOW', '2022-06-01'),
('EQU', '0000001', 'HIGH', '2022-06-01');
