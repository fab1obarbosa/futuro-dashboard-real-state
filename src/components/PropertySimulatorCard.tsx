
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyData {
  estado: string;
  cidade: string;
  tipo: string;
  finalidade: string;
  valorCompra: string;
  financiamento: string;
  valorEntrada: string;
  valorFinanciado: string;
  percentualJuros: string;
  prazoFinanciamento: string;
  valorParcela: string;
  taxaCartorio: string;
  reformaMobilia: string;
  outrasDespesas: string;
}

interface PropertySimulatorCardProps {
  data: PropertyData;
  setData: (data: PropertyData) => void;
}

const estadosBrasil = [
  "AC - Acre", "AL - Alagoas", "AP - Amapá", "AM - Amazonas", "BA - Bahia", "CE - Ceará", 
  "DF - Distrito Federal", "ES - Espírito Santo", "GO - Goiás", "MA - Maranhão", "MT - Mato Grosso", 
  "MS - Mato Grosso do Sul", "MG - Minas Gerais", "PA - Pará", "PB - Paraíba", "PR - Paraná", 
  "PE - Pernambuco", "PI - Piauí", "RJ - Rio de Janeiro", "RN - Rio Grande do Norte", 
  "RS - Rio Grande do Sul", "RO - Rondônia", "RR - Roraima", "SC - Santa Catarina", 
  "SP - São Paulo", "SE - Sergipe", "TO - Tocantins"
];

const cidadesPorEstado = {
  "AC - Acre": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasileia", "Plácido de Castro", "Xapuri", "Epitaciolândia", "Mâncio Lima", "Senador Guiomard", "Porto Walter", "Rodrigues Alves", "Capixaba", "Acrelândia", "Bujari", "Jordão", "Porto Acre", "Marechal Thaumaturgo", "Santa Rosa do Purus", "Manoel Urbano", "Assis Brasil"],
  
  "AL - Alagoas": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "São Miguel dos Campos", "Santana do Ipanema", "Delmiro Gouveia", "Coruripe", "São Luís do Quitunde", "Marechal Deodoro", "Pilar", "Murici", "Piranhas", "Craíbas", "Girau do Ponciano", "São Sebastião", "Mata Grande", "Água Branca", "Pão de Açúcar", "Viçosa", "Porto Calvo", "Campo Alegre", "Quebrangulo", "São José da Laje", "Matriz de Camaragibe", "Colônia Leopoldina", "Messias", "Flexeiras", "Branquinha", "Jacuípe", "Porto de Pedras", "Jequiá da Praia", "Roteiro", "Barra de Santo Antônio", "Coqueiro Seco", "Satuba", "Santa Luzia do Norte", "Paripueira", "Barra de São Miguel", "Piaçabuçu", "Feliz Deserto", "Igreja Nova", "Porto Real do Colégio", "São Brás", "Teotônio Vilela", "Anadia", "Junqueiro", "Taquarana", "Limoeiro de Anadia", "Campo Grande", "Cacimbinhas", "Igaci", "Craíbas", "Palmeira dos Índios", "Quebrangulo", "São José da Tapera", "Belém", "Olivença", "Tanque d'Arca", "Estrela de Alagoas", "Maravilha", "Ouro Branco", "Minador do Negrão", "Major Isidoro", "Mar Vermelho", "Carneiros", "Dois Riachos", "Olho d'Água do Casado", "Inhapi", "Mata Grande", "Canapi", "Delmiro Gouveia", "Olho d'Água das Flores", "Piranhas", "Água Branca", "Pariconha", "Santana do Ipanema", "Poço das Trincheiras", "Batalha", "Jacaré dos Homens", "Monteirópolis", "Senador Rui Palmeira", "Olivença", "Maribondo", "Palestina", "Cacimbinhas", "Belo Monte", "Jaramataia", "Chã Preta", "Palmeira dos Índios", "Quebrangulo", "São José da Tapera", "Belém", "Olivença", "Tanque d'Arca", "Estrela de Alagoas", "Maravilha", "Ouro Branco", "Minador do Negrão", "Major Isidoro", "Mar Vermelho", "Carneiros"],
  
  "AP - Amapá": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Mazagão", "Tartarugalzinho", "Vitória do Jari", "Itaubal", "Pedra Branca do Amapari", "Serra do Navio", "Calçoene", "Amapá", "Pracuúba", "Cutias", "Ferreira Gomes"],
  
  "AM - Amazonas": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Paulo de Olivença", "Humaitá", "Lábrea", "Manicoré", "Carauari", "Eirunepé", "Barcelos", "São Gabriel da Cachoeira", "Presidente Figueiredo", "Iranduba", "Rio Preto da Eva", "Novo Airão", "Silves", "Itapiranga", "Urucurituba", "Nhamundá", "Barreirinha", "Boa Vista do Ramos", "Maués", "Urucará", "São Sebastião do Uatumã", "Autazes", "Careiro", "Careiro da Várzea", "Manaquiri", "Beruri", "Anori", "Anamã", "Caapiranga", "Codajás", "Tapauá", "Coari", "Tefé", "Alvarães", "Uarini", "Fonte Boa", "Japurá", "Maraã", "Jutaí", "Tonantins", "São Paulo de Olivença", "Amaturá", "Santo Antônio do Içá", "Tabatinga", "Benjamin Constant", "Atalaia do Norte", "Guajará", "Ipixuna", "Eirunepé", "Envira", "Carauari", "Juruá", "Itamarati", "Pauini", "Lábrea", "Canutama", "Humaitá", "Manicoré", "Novo Aripuanã", "Borba", "Nova Olinda do Norte", "Maués", "Boa Vista do Ramos", "Barreirinha", "Nhamundá", "Urucará", "São Sebastião do Uatumã", "Presidente Figueiredo", "Rio Preto da Eva", "Iranduba", "Manacapuru", "Novo Airão", "Barcelos", "Santa Isabel do Rio Negro", "São Gabriel da Cachoeira", "Japurá"],
  
  "BA - Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Ilhéus", "Lauro de Freitas", "Itabuna", "Jequié", "Alagoinhas", "Barreiras", "Paulo Afonso", "Eunápolis", "Simões Filho", "Santo Antônio de Jesus", "Teixeira de Freitas", "Jacobina", "Porto Seguro", "Valença", "Candeias", "Guanambi", "Irecê", "Senhor do Bonfim", "Dias d'Ávila", "Luís Eduardo Magalhães", "Santo Amaro", "Brumado", "Itapetinga", "Casa Nova", "Bom Jesus da Lapa", "Conceição do Coité", "Cruz das Almas", "Ribeira do Pombal", "Serrinha", "Euclides da Cunha", "Itamaraju", "Tucano", "Wenceslau Guimarães", "Mata de São João", "Entre Rios", "Pojuca", "Madre de Deus", "São Francisco do Conde", "Cachoeira", "São Félix", "Muritiba", "Governador Mangabeira", "Sapeaçu", "Conceição da Feira", "Coração de Maria", "Amélia Rodrigues", "São Gonçalo dos Campos", "Anguera", "Antônio Cardoso", "Conceição do Jacuípe", "Feira de Santana", "Ipecaetá", "Irará", "Santa Bárbara", "Santanópolis", "Santo Estêvão", "São José do Jacuípe", "Tanquinho", "Teodoro Sampaio", "Terra Nova", "Água Fria", "Aramari", "Catu", "Inhambupe", "Itanagra", "Mata de São João", "Pojuca", "Cardeal da Silva", "Conde", "Esplanada", "Jandaíra", "Rio Real", "Acajutiba", "Alagoinhas", "Araçás", "Crisópolis", "Olindina", "Ouriçangas", "Pereira", "Rio Real", "Sátiro Dias", "Ribeira do Amparo", "Ribeira do Pombal", "Cipó", "Heliópolis", "Nova Soure", "Paripiranga", "Antas", "Coronel João Sá", "Jeremoabo", "Pedro Alexandre", "Sento Sé", "Campo Formoso", "Filadélfia", "Pindobaçu", "Senhor do Bonfim", "Andorinha", "Antônio Gonçalves", "Caldeirão Grande", "Itiúba", "Jaguarari", "Monte Santo", "Nordestina", "Queimadas", "Quijingue", "Saúde", "Serrolândia", "Uauá", "Umburanas", "Várzea da Roça", "Várzea do Poço", "Capim Grosso", "Gavião", "Iaçu", "Itaberaba", "Lajedinho", "Macajuba", "Mairi", "Mundo Novo", "Piritiba", "Ruy Barbosa", "São José do Jacuípe", "Tapiramutá", "Várzea da Roça", "Várzea do Poço", "Wagner", "Baixa Grande", "Boa Vista do Tupim", "Feira da Mata", "Ichu", "Ipirá", "Lapão", "Mulungu do Morro", "Nova Fátima", "Presidente Dutra", "Rafael Jambeiro", "Riachão do Jacuípe", "Santa Luz", "Serrinha", "Teofilândia", "Valente", "Cansanção", "Itiúba", "Monte Santo", "Nordestina", "Queimadas", "Quijingue", "Saúde", "Uauá", "Euclides da Cunha", "Canudos", "Chorrochó", "Macururé", "Rodelas", "Abaré", "Curaçá", "Juazeiro", "Sobradinho", "Casa Nova", "Remanso", "Pilão Arcado", "Campo Alegre de Lourdes", "Sento Sé"],

  "CE - Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Canindé", "Aquiraz", "Pacatuba", "Crateús", "Russas", "Aracati", "Camocim", "Horizonte", "Pacajus", "São Gonçalo do Amarante", "Eusébio", "Paracuru", "Barbalha", "Limoeiro do Norte", "Tianguá", "Acopiara", "Cascavel", "Icó", "Jijoca de Jericoacoara", "Tauá", "Viçosa do Ceará", "Granja", "Independência", "Morada Nova", "Jaguaribe", "Itarema", "Trairi", "Paraipaba", "São Luís do Curu", "Pentecoste", "Redenção", "Acaraú", "Marco", "Morrinhos", "Bela Cruz", "Cruz", "Jijoca de Jericoacoara", "Camocim", "Barroquinha", "Chaval", "Granja", "Martinópole", "Uruoca", "Viçosa do Ceará", "Tianguá", "Ubajara", "Frecheirinha", "Coreaú", "Sobral", "Groaíras", "Reriutaba", "Varjota", "Santana do Acaraú", "Meruoca", "Alcântaras", "Cariré", "Forquilha", "Graça", "Hidrolândia", "Ipu", "Ipueiras", "Massapê", "Mucambo", "Pacujá", "Pires Ferreira", "Santa Quitéria", "São Benedito"],

  "DF - Distrito Federal": ["Brasília", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina", "Paranoá", "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia", "Santa Maria", "São Sebastião", "Recanto das Emas", "Lago Sul", "Riacho Fundo", "Lago Norte", "Candangolândia", "Águas Claras", "Riacho Fundo II", "Sudoeste/Octogonal", "Varjão", "Park Way", "SCIA", "Sobradinho II", "Jardim Botânico", "Itapoã", "SIA", "Vicente Pires", "Fercal"],

  "ES - Espírito Santo": ["Vitória", "Cariacica", "Vila Velha", "Serra", "Cachoeiro de Itapemirim", "Linhares", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Viana", "Nova Venécia", "Barra de São Francisco", "Santa Teresa", "Castelo", "Marataízes", "Itapemirim", "Alegre", "Baixo Guandu", "Conceição da Barra", "Rio Novo do Sul", "Anchieta", "Piúma", "Afonso Cláudio", "Domingos Martins", "Santa Maria de Jetibá", "João Neiva", "Fundão", "Ibiraçu", "Santa Leopoldina", "Marechal Floriano", "Venda Nova do Imigrante", "Iconha", "Rio Novo do Sul", "Alfredo Chaves", "Guarapari", "Anchieta", "Piúma", "Itapemirim", "Marataízes", "Presidente Kennedy", "Atílio Vivácqua", "Muqui", "Mimoso do Sul", "Apiacá", "São José do Calçado", "Bom Jesus do Norte", "Divino de São Lourenço", "Dores do Rio Preto", "Guaçuí", "Alegre", "Jerônimo Monteiro", "Cachoeiro de Itapemirim", "Castelo", "Vargem Alta", "Muniz Freire", "Brejetuba", "Conceição do Castelo", "Venda Nova do Imigrante", "Domingos Martins", "Marechal Floriano", "Alfredo Chaves", "Santa Maria de Jetibá", "Santa Teresa", "São Roque do Canaã", "Itarana", "Itaguaçu", "Santa Leopoldina", "Cariacica", "Viana", "Vila Velha", "Vitória", "Serra", "Fundão", "Ibiraçu", "João Neiva", "Aracruz", "Linhares", "Rio Bananal", "Sooretama", "Jaguaré", "São Mateus", "Conceição da Barra", "Pedro Canário", "Montanha", "Mucurici", "Ponto Belo", "Boa Esperança", "Vila Pavão", "São Gabriel da Palha", "Nova Venécia", "Vila Valério", "Governador Lindenberg", "Pancas", "Águia Branca", "São Domingos do Norte", "Barra de São Francisco", "Água Doce do Norte", "Mantenópolis", "Alto Rio Novo", "Ecoporanga", "Colatina", "Baixo Guandu", "Aimorés", "Resplendor", "Itueta", "São José do Calçado"],

  "GO - Goiás": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Senador Canedo", "Catalão", "Jataí", "Planaltina", "Caldas Novas", "Itumbiara", "Cidade Ocidental", "Mineiros", "Cristalina", "Inhumas", "Goianésia", "Quirinópolis", "Posse", "Ceres", "São Luís de Montes Belos", "Iporá", "Morrinhos", "Nerópolis", "Goianira", "Santo Antônio do Descoberto", "Hidrolândia", "Aragoiânia", "Bela Vista de Goiás", "Alexânia", "Silvânia", "Piracanjuba", "Cromínia", "Goiás", "Cocalzinho de Goiás", "Corumbá de Goiás", "Abadiânia", "Padre Bernardo", "Planaltina", "Vila Boa", "Cabeceiras", "Água Fria de Goiás", "São João d'Aliança", "Alto Paraíso de Goiás", "Cavalcante", "Teresina de Goiás", "Nova Roma", "São Domingos", "Divinópolis de Goiás", "Iaciara", "Mambaí", "Posse", "Simolândia", "Buritinópolis", "Guarani de Goiás", "São Desidério", "Flores de Goiás", "Sítio d'Abadia", "Formosa", "Vila Propício", "Minaçu", "Niquelândia", "Colinas do Sul", "Barro Alto", "Santa Rita do Novo Destino", "Uruaçu", "Rialma", "São Luíz do Norte", "Ceres", "Rianápolis", "Santa Isabel", "Carmo do Rio Verde", "Nova Glória", "Itapaci", "Goianésia", "Bela Vista de Goiás", "Piracanjuba", "Pontalina", "Caldas Novas", "Marzagão", "Corumbaíba", "Cumari", "Ipameri", "Orizona", "Palmelo", "Vianópolis", "Uirapuru", "Pires do Rio", "Santa Cruz de Goiás", "Cristianópolis", "Gameleira de Goiás", "Três Ranchos", "Caldas Novas", "Rio Quente", "Morrinhos", "Goiatuba", "Joviânia", "Aloândia do Sul", "Buriti Alegre", "Piracanjuba", "Pontalina", "Bela Vista de Goiás", "Leopoldo de Bulhões", "Silvânia", "Vianópolis", "Orizona", "Palmelo", "Ipameri", "Corumbaíba", "Cumari", "Anhanguera", "Campo Alegre de Goiás", "Catalão", "Davinópolis", "Ouvidor", "Três Ranchos", "Nova Aurora", "Água Limpa", "Buriti Alegre", "Marzagão", "Caldas Novas", "Rio Quente", "Morrinhos"],

  "MA - Maranhão": ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês", "Pinheiro", "Pedreiras", "Barra do Corda", "Chapadinha", "Coroatá", "Rosário", "Viana", "Raposa", "Presidente Dutra", "Grajaú", "Colinas", "Zé Doca", "Carolina", "Tuntum", "Tutóia", "Barreirinhas", "Santa Luzia", "Araioses", "Primeira Cruz", "Santo Amaro do Maranhão", "Humberto de Campos", "Cururupu", "Mirinzal", "Alcântara", "Bequimão", "Central do Maranhão", "Presidente Vargas", "Santa Helena", "Guimarães", "Cedral", "São Bento", "Turiaçu", "Carutapera", "Luís Domingues", "Godofredo Viana", "Marcação", "Cândido Mendes", "Bela Vista do Maranhão", "Maracaçumé", "Centro do Guilherme", "Centro Novo do Maranhão", "Marajá do Sena", "Viseu", "São João Batista", "Anajatuba", "Vargem Grande", "Arari", "Vitória do Mearim", "Igarapé Grande", "Lima Campos", "Esperantinópolis", "Arame", "Itaipava do Grajaú", "Lago da Pedra", "São Luís Gonzaga do Maranhão", "Governador Archer", "São Mateus do Maranhão", "Cachoeira Grande", "Olho d'Água das Cunhãs", "São Benedito do Rio Preto", "Água Doce do Maranhão", "Belágua", "São Félix de Balsas", "Tasso Fragoso", "Fortaleza dos Nogueiras", "Riachão", "Alto Parnaíba", "Sambaíba", "Loreto", "São Raimundo das Mangabeiras", "Nova Colinas", "Mirador", "Passagem Franca", "São João dos Patos", "Sucupira do Norte", "Barão de Grajaú", "Jenipapo dos Vieiras", "Sítio Novo", "São Domingos do Azeitão", "Lagoa Grande do Maranhão", "Paraibano", "Sucupira do Riachão", "Fernando Falcão", "Nova Iorque", "Ribamar Fiquene", "Governador Edison Lobão", "Lajeado Novo", "Estreito", "Porto Franco", "Campestre do Maranhão", "São Pedro da Água Branca", "Montes Altos", "Ribamar Fiquene", "Davinópolis", "Governador Edison Lobão", "João Lisboa", "Senador La Rocque", "Açailândia", "Cidelândia", "Vila Nova dos Martírios", "São Francisco do Brejão", "Buritirana", "Marabá", "São João do Paraíso", "Bom Jesus das Selvas", "Itinga do Maranhão"],

  "MT - Mato Grosso": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Barra do Garças", "Lucas do Rio Verde", "Primavera do Leste", "Sorriso", "Juína", "Mirassol d'Oeste", "Pontes e Lacerda", "Diamantino", "Alta Floresta", "Campo Verde", "Colíder", "Nova Mutum", "Guarantã do Norte", "Água Boa", "Confresa", "Juara", "Peixoto de Azevedo", "Nova Ubiratã", "Campos de Júlio", "São José do Rio Claro", "Sapezal", "Brasnorte", "Comodoro", "Vilhena", "Nova Maringá", "Paranatinga", "São Félix do Araguaia", "Querência", "Canarana", "Vila Rica", "Nova Xavantina", "Campinápolis", "Ribeirão Cascalheira", "Agua Boa", "Bom Jesus do Araguaia", "Luciára", "São José do Xingu", "Santa Terezinha", "Serra Nova Dourada", "Vila Rica", "Santa Cruz do Xingu", "Canabrava do Norte", "São Félix do Araguaia", "Araguaiana", "Torixoréu", "Ponte Branca", "Novo São Joaquim", "General Carneiro", "Dom Aquino", "Jaciara", "São Pedro da Cipa", "Juscimeira", "Rondonópolis", "Itiquira", "Pedra Preta", "Alto Garças", "Guiratinga", "Tesouro", "Ponte Branca", "Poxoréu", "Primavera do Leste", "Santo Antônio do Leste", "Campo Verde", "Nova Brasilândia", "Rosário Oeste", "Nobres", "Jangada", "Acorizal", "Cuiabá", "Várzea Grande", "Nossa Senhora do Livramento", "Poconé", "Barão de Melgaço", "Santo Antônio do Leverger", "Chapada dos Guimarães", "Planalto da Serra", "Nova Brasilândia", "Rosário Oeste", "Nobres", "Diamantino", "Alto Paraguai", "Arenápolis", "Nortelândia", "Nova Marilândia", "Nova Olimpia", "Denise", "Tangará da Serra", "Barra do Bugres", "Nova Olímpia", "Porto Estrela", "Santo Afonso", "Figueirópolis d'Oeste", "Jauru", "Salto do Céu", "Lambari d'Oeste", "Reserva do Cabaçal", "Mirassol d'Oeste", "Cáceres", "Curvelândia", "Indiavaí", "Glória d'Oeste", "São José dos Quatro Marcos", "Rio Branco", "Conquista d'Oeste", "Pontes e Lacerda", "Vila Bela da Santíssima Trindade", "Comodoro", "Campos de Júlio", "Sapezal"],

  "MS - Mato Grosso do Sul": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Aquidauana", "Sidrolândia", "Nova Andradina", "Naviraí", "Coxim", "Paranaíba", "Caarapó", "Amambai", "Chapadão do Sul", "Maracaju", "São Gabriel do Oeste", "Ribas do Rio Pardo", "Bonito", "Anastácio", "Jardim", "Ivinhema", "Cassilândia", "Aparecida do Taboado", "Bataguassu", "Miranda", "Terenos", "Dois Irmãos do Buriti", "Rochedo", "Nova Alvorada do Sul", "Bandeirantes", "Jaraguari", "Camapuã", "Água Clara", "Costa Rica", "Pedro Gomes", "Sonora", "Alcinópolis", "Rio Verde de Mato Grosso", "Figueirão", "Bodoquena", "Nioaque", "Guia Lopes da Laguna", "Bela Vista", "Caracol", "Porto Murtinho", "Bonito", "Jardim", "Anastácio", "Aquidauana", "Dois Irmãos do Buriti", "Miranda", "Corumbá", "Ladário", "Coxim", "Rio Verde de Mato Grosso", "São Gabriel do Oeste", "Camapuã", "Pedro Gomes", "Sonora", "Alcinópolis", "Figueirão", "Costa Rica", "Chapadão do Sul", "Cassilândia", "Aparecida do Taboado", "Paranaíba", "Inocência", "Selvíria", "Três Lagoas", "Brasilândia", "Santa Rita do Pardo", "Água Clara", "Ribas do Rio Pardo", "Nova Alvorada do Sul", "Bandeirantes", "Jaraguari", "Rochedo", "Terenos", "Sidrolândia", "Maracaju", "Rio Brilhante", "Nova Alvorada do Sul", "Sidrolândia", "Campo Grande", "Terenos", "Dois Irmãos do Buriti", "Aquidauana", "Anastácio", "Bonito", "Jardim", "Guia Lopes da Laguna", "Nioaque", "Bodoquena", "Miranda", "Corumbá", "Ladário", "Porto Murtinho", "Bela Vista", "Caracol", "Ponta Porã", "Dourados", "Douradina", "Fátima do Sul", "Jateí", "Caarapó", "Laguna Carapã", "Amambai", "Aral Moreira", "Coronel Sapucaia", "Paranhos", "Sete Quedas", "Tacuru", "Iguatemi", "Eldorado", "Mundo Novo", "Japorã", "Naviraí", "Itaquiraí", "Nova Andradina", "Bataguassu", "Anaurilândia", "Angélica", "Ivinhema", "Deodápolis", "Glória de Dourados", "Vicentina"],

  "MG - Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas", "Teófilo Otoni", "Barbacena", "Sabará", "Vespasiano", "Conselheiro Lafaiete", "Varginha", "Itabira", "Passos", "Coronel Fabriciano", "Muriaé", "Ituiutaba", "Araguari", "Lavras", "Nova Lima", "Itajubá", "Pará de Minas", "Manhuaçu", "Timóteo", "Unaí", "Patrocínio", "Pouso Alegre", "João Monlevade", "Januária", "Formiga", "Esmeraldas", "Pedro Leopoldo", "Ponte Nova", "Lagoa Santa", "Mariana", "Frutal", "São João del Rei", "Três Corações", "Viçosa", "Cataguases", "Ouro Preto", "Janaúba", "São Sebastião do Paraíso", "Paracatu", "Caratinga", "Nova Serrana", "São Lourenço", "Leopoldina", "Várzea da Palma", "Curvelo", "Alfenas", "João Pinheiro", "Campo Belo", "Ouro Branco", "Congonhas", "Matozinhos", "Pirapora", "Itaúna", "Nanuque", "Ubá", "Paraguaçu", "Três Pontas", "Santos Dumont", "Guaxupé", "Lagoa da Prata", "Bom Despacho", "São Francisco", "Arcos", "Caeté", "Oliveira", "Jaíba", "Monte Carmelo", "Boa Esperança", "Pompéu", "Machado", "Campo do Meio", "Abaeté", "Tupaciguara", "Andradas", "São Gotardo", "Carmo do Paranaíba", "Rio Paranaíba", "Serra do Salitre", "Coromandel", "Vazante", "Araxá", "Perdizes", "Ibiá", "Campos Altos", "Sacramento", "Uberaba", "Conceição das Alagoas", "Delta", "Veríssimo", "Conquista", "Água Comprida", "Comendador Gomes", "Planura", "Fronteira", "Frutal", "Itapagipe", "Iturama", "Carneirinho", "Araguari", "Indianópolis", "Nova Ponte", "Romaria", "Estrela do Sul", "Grupiara", "Cascalho Rico", "Douradoquara", "Centralina", "Capinópolis", "Ituiutaba", "Gurinhatã", "Monte Alegre de Minas", "Campina Verde", "Uberlândia", "Araguari", "Monte Carmelo", "Tupaciguara", "Indianópolis", "Nova Ponte", "Romaria", "Estrela do Sul", "Grupiara", "Cascalho Rico", "Douradoquara", "Centralina", "Capinópolis", "Ituiutaba", "Gurinhatã", "Monte Alegre de Minas", "Campina Verde", "Prata", "Sacramento", "Uberaba", "Conceição das Alagoas", "Delta", "Veríssimo", "Conquista"],

  "PA - Pará": ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Bragança", "Itaituba", "Barcarena", "Tucuruí", "Paragominas", "Altamira", "Capanema", "Redenção", "Tailândia", "Benevides", "Marituba", "Breves", "Oriximiná", "Óbidos", "Vigia", "São Miguel do Guamá", "Monte Alegre", "Medicilândia", "Rondon do Pará", "Dom Eliseu", "Conceição do Araguaia", "São Félix do Xingu", "Novo Repartimento", "Xinguara", "Abel Figueiredo", "Goianésia do Pará", "Bom Jesus do Tocantins", "Jacundá", "Nova Ipixuna", "Novo Repartimento", "Tucumã", "Ourilândia do Norte", "Água Azul do Norte", "Eldorado dos Carajás", "Curionópolis", "Canaã dos Carajás", "Parauapebas", "Marabá", "São Geraldo do Araguaia", "São João do Araguaia", "Piçarra", "Palestina do Pará", "Bannach", "Cumaru do Norte", "Sapucaia", "Redenção", "Rio Maria", "Floresta do Araguaia", "Conceição do Araguaia", "Santa Maria das Barreiras", "Santana do Araguaia", "São Félix do Xingu", "Tucumã", "Ourilândia do Norte", "Água Azul do Norte", "Xinguara", "Canaã dos Carajás", "Curionópolis", "Eldorado dos Carajás", "Parauapebas", "Marabá", "São Geraldo do Araguaia", "São João do Araguaia", "Jacundá", "Nova Ipixuna", "Novo Repartimento", "Goianésia do Pará", "Bom Jesus do Tocantins", "Abel Figueiredo", "Rondon do Pará", "Dom Eliseu", "Ulianópolis", "Paragominas", "Ipixuna do Pará", "Tomé-Açu", "Aurora do Pará", "Capitão Poço", "Garrafão do Norte", "São Domingos do Capim", "Irituia", "Mãe do Rio", "Nova Esperança do Piriá", "Cachoeira do Piriá", "Viseu", "Augusto Corrêa", "Primavera", "Quatipuru", "Tracuateua", "Bragança", "Capanema", "Salinópolis", "São João de Pirabas", "Maracanã", "Magalhães Barata", "Marapanim", "Curuçá", "Terra Alta", "São Caetano de Odivelas", "Vigia", "Colares", "Santo Antônio do Tauá", "São João da Ponta", "Castanhal", "Inhangapi", "Santa Isabel do Pará", "São Miguel do Guamá", "Nova Timboteua", "Bonito", "Santa Maria do Pará", "São Francisco do Pará", "Igarapé-Açu", "Maracanã", "Magalhães Barata", "Marapanim", "Curuçá", "Terra Alta", "São Caetano de Odivelas", "Vigia", "Colares", "Santo Antônio do Tauá", "Benevides", "Ananindeua", "Marituba", "Belém", "Barcarena", "Abaetetuba", "Moju", "Acará", "Tailândia", "Tomé-Açu", "Concórdia do Pará", "Bujaru", "São Domingos do Capim", "Aurora do Pará", "Ipixuna do Pará", "Paragominas", "Ulianópolis", "Dom Eliseu", "Rondon do Pará", "Abel Figueiredo", "Bom Jesus do Tocantins", "Goianésia do Pará", "Novo Repartimento", "Jacundá", "Nova Ipixuna", "São João do Araguaia", "São Geraldo do Araguaia", "Marabá", "Parauapebas", "Canaã dos Carajás", "Curionópolis", "Eldorado dos Carajás", "Água Azul do Norte", "Xinguara", "Ourilândia do Norte", "Tucumã", "São Félix do Xingu", "Santana do Araguaia", "Santa Maria das Barreiras", "Conceição do Araguaia", "Floresta do Araguaia", "Rio Maria", "Redenção", "Sapucaia", "Cumaru do Norte", "Bannach", "Palestina do Pará", "Piçarra"],

  "PB - Paraíba": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Esperança", "Mamanguape", "São Bento", "Monteiro", "Conde", "Pombal", "Itabaiana", "Areia", "Picuí", "Caaporã", "Alagoa Grande", "Lucena", "Cruz do Espírito Santo", "Pedras de Fogo", "Mari", "Alagoa Nova", "Alagoinha", "Mulungu", "Remígio", "Solânea", "Bananeiras", "Borborema", "Tacima", "Campo de Santana", "Duas Estradas", "Dona Inês", "Riachão", "Cuitegi", "Belém", "Serraria", "Sapé", "Sobrado", "Pilar", "Capim", "Alhandra", "Caaporã", "Pitimbu", "Conde", "Marcação", "Baía da Traição", "Rio Tinto", "Mamanguape", "Curral de Cima", "Cuité de Mamanguape", "Itapororoca", "Jacaraú", "Pedro Régis", "Duas Estradas", "Caiçara", "Alagoa Grande", "Mulungu", "Alagoa Nova", "Alagoinha", "Areia", "Remígio", "Solânea", "Bananeiras", "Borborema", "Tacima", "Campo de Santana", "Dona Inês", "Riachão", "Cuitegi", "Belém", "Serraria", "Esperança", "Algodão de Jandaíra", "Areial", "Remigio", "Solânea", "Bananeiras", "Borborema", "Tacima", "Campo de Santana", "Duas Estradas", "Dona Inês", "Riachão", "Cuitegi", "Belém", "Serraria", "Guarabira", "Cuitegi", "Alagoinha", "Mulungu", "Alagoa Nova", "Areia", "Remígio", "Solânea", "Bananeiras", "Borborema", "Tacima", "Campo de Santana", "Duas Estradas", "Dona Inês", "Riachão", "Belém", "Serraria", "Esperança", "Algodão de Jandaíra", "Areial", "Campina Grande", "Massaranduba", "Ingá", "Itatuba", "Juarez Távora", "Riachão do Poço", "Salgado de São Félix", "Fagundes", "Queimadas", "Gado Bravo", "Barra de Santana", "Boa Vista", "Cabaceiras", "São João do Cariri", "Amparo", "Assunção", "Camalaú", "Monteiro", "Sumé", "Congo", "Coxixola", "Taperoá", "Juazeirinho", "Olivedos", "Tenório", "Salgadinho", "Alcantil", "Barra de São Miguel", "Livramento", "Santo André", "São José dos Cordeiros", "Parari", "Gurjão", "Soledade", "Juazeirinho", "Olivedos", "Tenório", "Salgadinho", "Alcantil", "Barra de São Miguel", "Livramento", "Santo André", "São José dos Cordeiros", "Parari", "Gurjão", "Soledade"],

  "PR - Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo", "Arapongas", "Almirante Tamandaré", "Umuarama", "Piraquara", "Cambé", "Campo Mourão", "Fazenda Rio Grande", "Sarandi", "Fazenda Belém", "Paranavaí", "Francisco Beltrão", "Pato Branco", "Cianorte", "Telêmaco Borba", "Castro", "Rolândia", "Irati", "União da Vitória", "Ibiporã", "Prudentópolis", "Marechal Cândido Rondon", "Cornélio Procópio", "São Mateus do Sul", "Palmas", "Matinhos", "Lapa", "Campo Magro", "Tijucas do Sul", "Mandirituba", "Quitandinha", "Agudos do Sul", "Piên", "Rio Negro", "Mafra", "Itaperuçu", "Rio Branco do Sul", "Cerro Azul", "Doutor Ulysses", "Tunas do Paraná", "Bocaiúva do Sul", "Campina Grande do Sul", "Quatro Barras", "Pinhais", "São José dos Pinhais", "Fazenda Rio Grande", "Mandirituba", "Tijucas do Sul", "Agudos do Sul", "Quitandinha", "Piên", "Campo Largo", "Balsa Nova", "Contenda", "Lapa", "Porto Amazonas", "Rio Negro", "Mafra", "Itaperuçu", "Almirante Tamandaré", "Rio Branco do Sul", "Cerro Azul", "Doutor Ulysses", "Tunas do Paraná", "Bocaiúva do Sul", "Colombo", "Campina Grande do Sul", "Quatro Barras", "Piraquara", "Curitiba", "Araucária", "São José dos Pinhais", "Fazenda Rio Grande", "Pinhais", "Colombo", "Almirante Tamandaré", "Campo Largo", "Piraquara", "Quatro Barras", "Campina Grande do Sul", "Bocaiúva do Sul", "Tunas do Paraná", "Cerro Azul", "Doutor Ulysses", "Rio Branco do Sul", "Itaperuçu", "Campo Magro", "Balsa Nova", "Contenda", "Lapa", "Porto Amazonas", "Mandirituba", "Tijucas do Sul", "Agudos do Sul", "Quitandinha", "Piên", "Rio Negro", "Mafra", "Carambeí", "Castro", "Tibagi", "Telêmaco Borba", "Ortigueira", "Reserva", "Cândido de Abreu", "Manoel Ribas", "Pitanga", "Turvo", "Guarapuava", "Candói", "Cantagalo", "Marquinho", "Goioxim", "Foz do Jordão", "Reserva do Iguaçu", "Laranjeiras do Sul", "Rio Bonito do Iguaçu", "Nova Laranjeiras", "Porto Barreiro", "Diamante do Sul", "Espigão Alto do Iguaçu", "Quedas do Iguaçu", "Chopinzinho", "Coronel Domingos Soares", "Mangueirinha", "Honório Serpa", "Cleverlândia", "Itapejara d'Oeste", "Vitorino", "Palmas", "Clevelândia", "Coronel Vivida", "Pato Branco", "Mariópolis", "São João", "Renascença", "Marmeleiro", "Ampére", "Realeza", "Santa Izabel do Oeste", "Flor da Serra do Sul", "Bela Vista da Caroba", "Enéas Marques", "Francisco Beltrão", "Manfrinópolis", "Dois Vizinhos", "São Jorge d'Oeste", "Verê", "Nova Prata do Iguaçu", "Salto do Lontra", "Santo Antônio do Sudoeste", "Barracão", "Bom Jesus do Sul", "Pranchita", "Ampére", "Realeza", "Santa Izabel do Oeste", "Flor da Serra do Sul", "Bela Vista da Caroba", "Enéas Marques", "Francisco Beltrão", "Manfrinópolis", "Dois Vizinhos", "São Jorge d'Oeste", "Verê", "Nova Prata do Iguaçu", "Salto do Lontra", "Santo Antônio do Sudoeste", "Barracão", "Bom Jesus do Sul", "Pranchita", "Capanema", "Planalto", "Santo Antônio do Sudoeste", "Salto do Lontra", "Nova Prata do Iguaçu", "Verê", "São Jorge d'Oeste", "Dois Vizinhos", "Manfrinópolis", "Francisco Beltrão", "Enéas Marques", "Bela Vista da Caroba", "Flor da Serra do Sul", "Santa Izabel do Oeste", "Realeza", "Ampére", "Pranchita", "Bom Jesus do Sul", "Barracão", "Santo Antônio do Sudoeste", "Capanema", "Planalto"],

  "PE - Pernambuco": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "São Lourenço da Mata", "Santa Cruz do Capibaribe", "Abreu e Lima", "Ipojuca", "Serra Talhada", "Araripina", "Gravatá", "Carpina", "Goiana", "Belo Jardim", "Arcoverde", "Ouricuri", "Escada", "Pesqueira", "Surubim", "Palmares", "Bezerros", "Salgueiro", "Paudalho", "Timbaúba", "São Bento do Una", "Limoeiro", "Buíque", "Afogados da Ingazeira", "Tabira", "São José do Egito", "Tupanatinga", "Inajá", "Flores", "Carnaubeira da Penha", "Belém de São Francisco", "Floresta", "Itacuruba", "Cabrobó", "Orocó", "Lagoa Grande", "Santa Maria da Boa Vista", "Petrolina", "Juazeiro", "Dormentes", "Afrânio", "Ouricuri", "Parnamirim", "Bodocó", "Exu", "Granito", "Moreilândia", "Santa Cruz", "Trindade", "Cedro", "Salgueiro", "Terra Nova", "Verdejante", "Mirandiba", "São José do Belmonte", "Serrita", "Betânia", "Custódia", "Ibimirim", "Inajá", "Manari", "Floresta", "Itacuruba", "Belém de São Francisco", "Carnaubeira da Penha", "Cabrobó", "Orocó", "Lagoa Grande", "Santa Maria da Boa Vista", "Petrolina", "Juazeiro", "Dormentes", "Afrânio", "Ouricuri", "Parnamirim", "Bodocó", "Exu", "Granito", "Moreilândia", "Santa Cruz", "Trindade", "Cedro", "Salgueiro", "Terra Nova", "Verdejante", "Mirandiba", "São José do Belmonte", "Serrita", "Betânia", "Custódia", "Ibimirim", "Inajá", "Manari", "Tupanatinga", "Buíque", "Pedra", "Venturosa", "Alagoinha", "Brejão", "Caetés", "Calçado", "Canhotinho", "Correntes", "Garanhuns", "Iati", "Jucati", "Jupi", "Lajedo", "Palmeirina", "Paranatama", "Saloá", "São Bento do Una", "São João", "Terezinha", "Angelim", "Bom Conselho", "Águas Belas", "Itaíba", "Pedra", "Venturosa", "Alagoinha", "Brejão", "Caetés", "Calçado", "Canhotinho", "Correntes", "Garanhuns", "Iati", "Jucati", "Jupi", "Lajedo", "Palmeirina", "Paranatama", "Saloá", "São Bento do Una", "São João", "Terezinha", "Angelim", "Bom Conselho", "Águas Belas", "Itaíba", "Capoeiras", "Arcoverde", "Pesqueira", "Poção", "Sanharó", "Alagoinha", "Brejão", "Caetés", "Calçado", "Canhotinho", "Correntes", "Garanhuns", "Iati", "Jucati", "Jupi", "Lajedo", "Palmeirina", "Paranatama", "Saloá", "São Bento do Una", "São João", "Terezinha", "Angelim", "Bom Conselho", "Águas Belas", "Itaíba", "Capoeiras", "Arcoverde", "Pesqueira", "Poção", "Sanharó"],

  "PI - Piauí": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Barras", "União", "Altos", "Campo Maior", "Pedro II", "Valença do Piauí", "Oeiras", "São Raimundo Nonato", "Esperantina", "José de Freitas", "Demerval Lobão", "Luzilândia", "Amarante", "Bom Jesus", "Corrente", "Uruçuí", "Regeneração", "Água Branca", "Cocal", "Luís Correia", "Ilha Grande", "Buriti dos Lopes", "Caxingó", "São João do Arraial", "Madeiro", "Miguel Alves", "Coivaras", "Capitão de Campos", "Elesbão Veloso", "Hugo Napoleão", "Lagoa Alegre", "Monsenhor Gil", "Regeneração", "Santo Antônio dos Milagres", "São Miguel do Tapuio", "Sigefredo Pacheco", "The Figueiredo", "Amarante", "Avelino Lopes", "Bertolínia", "Beneditinos", "Buriti dos Lopes", "Cajueiro da Praia", "Campinas do Piauí", "Canto do Buriti", "Capitão Gervásio Oliveira", "Caracol", "Caraúbas do Piauí", "Caridade do Piauí", "Castelo do Piauí", "Caxingó", "Cocal", "Cocal de Telha", "Cocal dos Alves", "Coivaras", "Colônia do Gurguéia", "Colônia do Piauí", "Conceição do Canindé", "Coronel José Dias", "Corrente", "Cristalândia do Piauí", "Cristino Castro", "Curimatá", "Currais", "Curral Novo do Piauí", "Curralinhos", "Demerval Lobão", "Dirceu Arcoverde", "Dom Expedito Lopes", "Dom Inocêncio", "Domingos Mourão", "Elesbão Veloso", "Eliseu Martins", "Esperantina", "Fartura do Piauí", "Flores do Piauí", "Floresta do Piauí", "Floriano", "Francinópolis", "Francisco Ayres", "Francisco Macedo", "Francisco Santos", "Fronteiras", "Geminiano", "Gilbués", "Guadalupe", "Guaribas", "Hugo Napoleão", "Ilha Grande", "Inhuma", "Ipiranga do Piauí", "Isaías Coelho", "Itainópolis", "Itaueira", "Jacobina do Piauí", "Jaicós", "Jardim do Mulato", "Jatobá do Piauí", "Jerumenha", "João Costa", "Joaquim Pires", "Joca Marques", "José de Freitas", "Juazeiro do Piauí", "Júlio Borges", "Jurema", "Lagoinha do Piauí", "Lagoa Alegre", "Lagoa de São Francisco", "Lagoa do Barro do Piauí", "Lagoa do Piauí", "Lagoa do Sítio", "Landri Sales", "Luís Correia", "Luzilândia", "Madeiro", "Manoel Emídio", "Marcolândia", "Marcos Parente", "Massapê do Piauí", "Matias Olímpio", "Miguel Alves", "Miguel Leão", "Milton Brandão", "Monsenhor Gil", "Monsenhor Hipólito", "Monte Alegre do Piauí", "Morro Cabeça no Tempo", "Morro do Chapéu do Piauí", "Murici dos Portelas", "Nazaré do Piauí", "Nazária", "Nossa Senhora de Nazaré", "Nossa Senhora dos Remédios", "Nova Santa Rita", "Novo Oriente do Piauí", "Novo Santo Antônio", "Oeiras", "Olho d'Água do Piauí", "Padre Marcos", "Paes Landim", "Pajeú do Piauí", "Palmeira do Piauí", "Palmeirais", "Paquetá", "Parnaguá", "Parnaíba", "Passagem Franca do Piauí", "Patos do Piauí", "Pau d'Arco do Piauí", "Paulistana", "Pavussu", "Pedro II", "Pedro Laurentino", "Picos", "Pimenteiras", "Pio IX", "Piracuruca", "Piripiri", "Porto", "Porto Alegre do Piauí", "Prata do Piauí", "Queimada Nova", "Redenção do Gurguéia", "Regeneração", "Riacho Frio", "Ribeira do Piauí", "Ribeiro Gonçalves", "Rio Grande do Piauí", "Santa Cruz do Piauí", "Santa Cruz dos Milagres", "Santa Filomena", "Santa Luz", "Santa Rosa do Piauí", "Santana do Piauí", "Santo Antônio de Lisboa", "Santo Antônio dos Milagres", "Santo Inácio do Piauí", "São Braz do Piauí", "São Félix do Piauí", "São Francisco de Assis do Piauí", "São Francisco do Piauí", "São Gonçalo do Gurguéia", "São Gonçalo do Piauí", "São João da Canabrava", "São João da Fronteira", "São João da Serra", "São João da Varjota", "São João do Arraial", "São João do Piauí", "São José do Divino", "São José do Peixe", "São José do Piauí", "São Julião", "São Lourenço do Piauí", "São Luis do Piauí", "São Miguel da Baixa Grande", "São Miguel do Fidalgo", "São Miguel do Tapuio", "São Pedro do Piauí", "São Raimundo Nonato", "Sebastião Barros", "Sebastião Leal", "Sigefredo Pacheco", "Simões", "Simplício Mendes", "Socorro do Piauí", "Sussuapara", "Tamboril do Piauí", "Tanque do Piauí", "Teresina", "União", "Uruçuí", "Valença do Piauí", "Várzea Branca", "Várzea Grande", "Vera Mendes", "Vila Nova do Piauí", "Wall Ferraz"],

  "RJ - Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Campos dos Goytacazes", "Belford Roxo", "São João de Meriti", "Petrópolis", "Volta Redonda", "Magé", "Macaé", "Itaboraí", "Cabo Frio", "Nova Friburgo", "Angra dos Reis", "Barra Mansa", "Teresópolis", "Mesquita", "Nilópolis", "Maricá", "Rio das Ostras", "Queimados", "Itaguaí", "Araruama", "Resende", "Japeri", "São Pedro da Aldeia", "Itaperuna", "Barra do Piraí", "Seropédica", "Saquarema", "Três Rios", "Valença", "Paraty", "Armação dos Búzios", "Cachoeiras de Macacu", "Rio Bonito", "Guapimirim", "Santo Antônio de Pádua", "Paraíba do Sul", "Vassouras", "São Fidélis", "Casimiro de Abreu", "São João da Barra", "Paracambi", "Paty do Alferes", "Itatiaia", "Bom Jesus do Itabapoana", "Mangaratiba", "Miguel Pereira", "Tanguá", "São Francisco de Itabapoana", "Arraial do Cabo", "Itaocara", "Miracema", "Cambuci", "Sumidouro", "São José do Vale do Rio Preto", "Natividade", "Pinheiral", "Conceição de Macabu", "Quissamã", "Piraí", "Silva Jardim", "Cordeiro", "Porciúncula", "Rio Claro", "Rio das Flores", "Mendes", "Carapebus", "Sapucaia", "Iguaba Grande", "Bom Jardim", "São Sebastião do Alto", "Engenheiro Paulo de Frontin", "Laje do Muriaé", "Cantagalo", "Italva", "Quatis", "Varre-Sai", "Areal", "Santa Maria Madalena", "Cardoso Moreira", "Porto Real", "Levy Gasparian", "Carmo", "Duas Barras", "São José de Ubá", "Macuco", "Trajano de Moraes", "Aperibé", "Macaé", "Maricá", "Rio das Ostras", "Casimiro de Abreu", "Silva Jardim", "Cabo Frio", "Armação dos Búzios", "Arraial do Cabo", "São Pedro da Aldeia", "Iguaba Grande", "Araruama", "Saquarema", "Maricá", "Niterói", "São Gonçalo", "Itaboraí", "Tanguá", "Rio Bonito", "Guapimirim", "Magé", "Duque de Caxias", "Nova Iguaçu", "Mesquita", "Nilópolis", "São João de Meriti", "Belford Roxo", "Queimados", "Japeri", "Seropédica", "Paracambi", "Engenheiro Paulo de Frontin", "Mendes", "Piraí", "Pinheiral", "Volta Redonda", "Barra Mansa", "Quatis", "Porto Real", "Resende", "Itatiaia", "Rio Claro", "Mangaratiba", "Paraty", "Angra dos Reis", "Itaguaí", "Seropédica", "Paracambi", "Engenheiro Paulo de Frontin", "Mendes", "Vassouras", "Miguel Pereira", "Paty do Alferes", "Paraíba do Sul", "Três Rios", "Areal", "Petrópolis", "Teresópolis", "São José do Vale do Rio Preto", "Sapucaia", "Levy Gasparian", "Sumidouro", "Carmo", "Cantagalo", "Cordeiro", "Duas Barras", "Bom Jardim", "Nova Friburgo", "Cachoeiras de Macacu", "Sapucaia", "Carmo", "Duas Barras", "Cordeiro", "Cantagalo", "São Sebastião do Alto", "Santa Maria Madalena", "Trajano de Moraes", "Conceição de Macabu", "Macuco", "Aperibé", "Itaocara", "São José de Ubá", "Cambuci", "Santo Antônio de Pádua", "Miracema", "Laje do Muriaé", "São Fidélis", "Cardoso Moreira", "Campos dos Goytacazes", "São Francisco de Itabapoana", "São João da Barra", "Quissamã", "Carapebus", "Macaé", "Conceição de Macabu", "Santa Maria Madalena", "Macuco", "Cantagalo", "Cordeiro", "São Sebastião do Alto", "Trajano de Moraes", "Bom Jesus do Itabapoana", "Varre-Sai", "Porciúncula", "Natividade", "Itaperuna", "Laje do Muriaé", "São José de Ubá", "Miracema", "Cambuci", "Santo Antônio de Pádua"],

  "RN - Rio Grande do Norte": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "São José de Mipibu", "Pau dos Ferros", "Extremoz", "Apodi", "João Câmara", "Santa Cruz", "Macau", "Nísia Floresta", "Nova Cruz", "Touros", "Baraúna", "Canguaretama", "Goianinha", "Areia Branca", "Monte Alegre", "Guamaré", "Tibau do Sul", "Caraúbas", "Pedro Avelino", "Upanema", "Parelhas", "São Paulo do Potengi", "Santo Antônio", "Jardim de Piranhas", "Tangará", "São Miguel", "São José do Campestre", "Serra Negra do Norte", "Barcelona", "Lagoa Nova", "Acari", "Campo Redondo", "São Vicente", "Pedro Velho", "Vera Cruz", "Taipu", "Bom Jesus", "Várzea", "Equador", "Lajes Pintadas", "Lagoa de Pedras", "Bodó", "Bento Fernandes", "Campo Grande", "Vila Flor", "Jandaíra", "Cruzeta", "Passa e Fica", "Timbaúba dos Batistas", "Passagem", "Serrinha", "Ruy Barbosa", "Pedra Preta", "Lagoa Salgada", "São José do Seridó", "Triunfo Potiguar", "São Bento do Norte", "Carnaubais", "Presidente Juscelino", "Cerro Corá", "Serra de São Bento", "Santa Maria", "Pilões", "Brejinho", "Jundiá", "Arês", "Espírito Santo", "Montanhas", "Boa Saúde", "Serra Caiada", "Jaçanã", "Santana do Seridó", "São Vicente do Seridó", "São Fernando", "Florânia", "Jardim do Seridó", "Ouro Branco", "Carnaúba dos Dantas", "Parelhas", "Equador", "Santana do Matos", "Jucurutu", "São Rafael", "Ipanguaçu", "Itajá", "Angicos", "Pendências", "Alto do Rodrigues", "Açu", "Fernando Pedroza", "Lajes", "Pedro Avelino", "Caiçara do Norte", "São Bento do Norte", "Pedra Grande", "Jandaíra", "Galinhos", "Macau", "Guamaré", "Alto do Rodrigues", "Ipanguaçu", "Itajá", "São Rafael", "Jucurutu", "Santana do Matos", "Bodó", "Lagoa Nova", "Cerro Corá", "Currais Novos", "Acari", "Carnaúba dos Dantas", "Parelhas", "Santana do Seridó", "São José do Seridó", "Cruzeta", "Florânia", "Tenente Laurentino Cruz", "São Vicente", "Jardim do Seridó", "Ouro Branco", "Caicó", "Timbaúba dos Batistas", "São Fernando", "Jardim de Piranhas", "São João do Sabugi", "Ipueira", "Serra Negra do Norte", "São José do Seridó", "Cruzeta", "Florânia", "Tenente Laurentino Cruz", "São Vicente", "Lajes Pintadas", "Campo Redondo", "Jaçanã", "Coronel Ezequiel", "Japi", "Santa Cruz", "Lajes Pintadas", "Campo Redondo", "Barcelona", "São Bento do Trairi", "Sítio Novo", "Tangará", "Serra Caiada", "Boa Saúde", "Lagoa Salgada", "Várzea", "Nova Cruz", "Montanhas", "Espírito Santo", "Arês", "Pedro Velho", "Canguaretama", "Baía Formosa", "Tibau do Sul", "Senador Georgino Avelino", "Goianinha", "Arês", "Pedro Velho", "Nova Cruz", "Montanhas", "Espírito Santo", "Brejinho", "Passagem", "Jundiá", "Várzea", "Santo Antônio", "Serrinha", "Bom Jesus", "Serra Caiada", "São Paulo do Potengi", "Riachuelo", "Ielmo Marinho", "São Gonçalo do Amarante", "Extremoz", "Ceará-Mirim", "Maxaranguape", "Rio do Fogo", "Touros", "Pedra Grande", "São Miguel do Gostoso", "Caiçara do Norte", "São Bento do Norte", "Galinhos", "Guamaré", "Macau", "Porto do Mangue", "Carnaubais", "Pendências", "Alto do Rodrigues", "Açu", "Fernando Pedroza", "Lajes", "Pedro Avelino", "Bento Fernandes", "João Câmara", "Jandaíra", "São Miguel do Gostoso", "Pureza", "Poço Branco", "Taipu", "Ielmo Marinho", "São Gonçalo do Amarante", "Extremoz", "Ceará-Mirim", "Maxaranguape", "Rio do Fogo", "Touros", "Pedra Grande", "São Miguel do Gostoso", "Caiçara do Norte", "São Bento do Norte", "Galinhos", "Guamaré", "Macau", "Porto do Mangue"],

  "RS - Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Uruguaiana", "Sapucaia do Sul", "Santa Cruz do Sul", "Cachoeirinha", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba", "Cachoeira do Sul", "Santana do Livramento", "Esteio", "Ijuí", "Farroupilha", "Santo Ângelo", "Alegrete", "Lajeado", "Sapiranga", "Campo Bom", "Montenegro", "Camaquã", "Cruz Alta", "Vacaria", "Santa Rosa", "Venâncio Aires", "Caçapava do Sul", "Tramandaí", "São Borja", "Santiago", "Capão da Canoa", "Eldorado do Sul", "Taquara", "Parobé", "São Gabriel", "Osório", "Dom Pedrito", "Itaqui", "Esteio", "Três Passos", "Soledade", "Garibaldi", "Canguçu", "Torres", "Giruá", "Ibirubá", "Três Coroas", "Charqueadas", "Estância Velha", "Restinga Seca", "Canela", "Cacequi", "Quaraí", "Horizontina", "Jaguarão", "Palmeira das Missões", "Frederico Westphalen", "Vera Cruz", "Teutônia", "Igrejinha", "São Francisco de Paula", "Taquari", "Lagoa Vermelha", "São Lourenço do Sul", "Carazinho", "São Sepé", "Dois Irmãos", "Nova Petrópolis", "Rosário do Sul", "Flores da Cunha", "Getúlio Vargas", "São Luiz Gonzaga", "Chapada", "Pinheiro Machado", "Crissiumal", "São Pedro do Sul", "Gramado", "Agudo", "Barra do Ribeiro", "Riozinho", "Igrejinha", "Rolante", "Três Coroas", "Canela", "Gramado", "Nova Petrópolis", "Picada Café", "Linha Nova", "Presidente Lucena", "Ivoti", "Dois Irmãos", "Campo Bom", "Sapiranga", "Nova Hartz", "Araricá", "Parobé", "Taquara", "Glorinha", "Gravataí", "Cachoeirinha", "Alvorada", "Viamão", "Porto Alegre", "Canoas", "Esteio", "Sapucaia do Sul", "São Leopoldo", "Novo Hamburgo", "Estância Velha", "Portão", "São José do Hortêncio", "São Sebastião do Caí", "Bom Princípio", "Feliz", "Alto Feliz", "Vale Real", "Tupandi", "Harmonia", "Montenegro", "Brochier", "Maratá", "Salvador do Sul", "São Pedro da Serra", "Barão", "Carlos Barbosa", "Bento Gonçalves", "Garibaldi", "Veranópolis", "Nova Roma do Sul", "Antônio Prado", "Flores da Cunha", "Nova Pádua", "Farroupilha", "Caxias do Sul", "São Marcos", "Campestre da Serra", "Monte Alegre dos Campos", "Bom Jesus", "Jaquirana", "São José dos Ausentes", "Cambará do Sul", "São Francisco de Paula", "Canela", "Gramado", "Nova Petrópolis", "Picada Café", "Jaguarão", "Arroio Grande", "Herval", "Pedro Osório", "Cerrito", "Piratini", "Pinheiro Machado", "Candiota", "Hulha Negra", "Bagé", "Dom Pedrito", "Santana do Livramento", "Quaraí", "Rosário do Sul", "Alegrete", "São Francisco de Assis", "Manoel Viana", "Maçambará", "Itaqui", "São Borja", "Uruguaiana", "Barra do Quaraí", "Itaqui", "São Borja", "Garruchos", "Santo Antônio das Missões", "São Luiz Gonzaga", "Bossoroca", "São Nicolau", "Pirapó", "Dezesseis de Novembro", "São Miguel das Missões", "Eugênio de Castro", "Entre-Ijuís", "Vitória das Missões", "Santo Antônio das Missões", "São Luiz Gonzaga", "Bossoroca", "São Nicolau", "Pirapó", "Dezesseis de Novembro", "São Miguel das Missões", "Eugênio de Castro", "Entre-Ijuís", "Vitória das Missões", "Santo Ângelo", "Chiapetta", "Catuípe", "Giruá", "Senador Salgado Filho", "Guarani das Missões", "Cerro Largo", "Salvador das Missões", "São Pedro do Butiá", "Roque Gonzales", "Porto Xavier", "Porto Lucena", "Santo Cristo", "Santa Rosa", "Cândido Godói", "Tuparendi", "Alecrim", "Novo Machado", "Tucunduva", "Tuparendi", "Campina das Missões", "São Paulo das Missões", "Porto Vera Cruz", "Santo Cristo", "Santa Rosa", "Horizontina", "Tucunduva", "Três de Maio", "Independência", "Alegria", "Três de Maio", "Boa Vista do Buricá", "Nova Candelária", "São José do Inhacorá", "Doutor Maurício Cardoso", "Horizontina", "Tucunduva", "Novo Machado", "Porto Mauá", "Alecrim", "Porto Vera Cruz", "Santo Cristo", "Santa Rosa", "Cândido Godói", "Ubiretama", "Cerro Largo", "São Paulo das Missões", "Porto Xavier"],

  "RO - Rondônia": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Pimenta Bueno", "Ouro Preto do Oeste", "Espigão d'Oeste", "Buritis", "Colorado do Oeste", "Alta Floresta d'Oeste", "São Miguel do Guaporé", "Presidente Médici", "Nova Mamoré", "Seringueiras", "Chupinguaia", "Machadinho d'Oeste", "Candeias do Jamari", "Alto Alegre dos Parecis", "São Francisco do Guaporé", "Santa Luzia d'Oeste", "Cerejeiras", "Nova Brasilândia d'Oeste", "Theobroma", "Cujubim", "Alvorada d'Oeste", "Urupá", "Mirante da Serra", "Vale do Paraíso", "Cacaulândia", "São Felipe d'Oeste", "Parecis", "Rio Crespo", "Monte Negro", "Campo Novo de Rondônia", "Primavera de Rondônia", "Novo Horizonte do Oeste", "Castanheiras", "Nova União", "Governador Jorge Teixeira", "Ministro Andreazza", "Alto Paraíso", "Cabixi", "Corumbiara", "Teixeirópolis", "Vale do Anari", "Costa Marques", "Itapuã do Oeste", "Porto Velho", "Candeias do Jamari", "Itapuã do Oeste", "Cujubim", "Rio Crespo", "Alto Paraíso", "Machadinho d'Oeste", "Vale do Anari", "Ariquemes", "Monte Negro", "Cacaulândia", "Jaru", "Governador Jorge Teixeira", "Theobroma", "Vale do Paraíso", "Ouro Preto do Oeste", "Nova União", "Teixeirópolis", "Urupá", "Alvorada d'Oeste", "Ji-Paraná", "Presidente Médici", "Ministro Andreazza", "Cacoal", "Espigão d'Oeste", "Pimenta Bueno", "Primavera de Rondônia", "São Felipe d'Oeste", "Parecis", "Chupinguaia", "Vilhena", "Cerejeiras", "Corumbiara", "Cabixi", "Colorado do Oeste", "Guajará-Mirim", "Nova Mamoré", "Seringueiras", "São Francisco do Guaporé", "Costa Marques", "São Miguel do Guaporé", "Novo Horizonte do Oeste", "Castanheiras", "Rolim de Moura", "Santa Luzia d'Oeste", "Alta Floresta d'Oeste", "Alto Alegre dos Parecis"],

  "RR - Roraima": ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí", "Cantá", "Bonfim", "Pacaraima", "São João da Baliza", "São Luiz", "Iracema", "Normandia", "Amajari", "Uiramutã", "Caroebe", "Caracaraí", "São João da Baliza", "São Luiz", "Caroebe", "Rorainópolis", "Boa Vista", "Alto Alegre", "Mucajaí", "Cantá", "Bonfim", "Pacaraima", "Normandia", "Amajari", "Uiramutã", "Iracema", "Caracaraí", "São João da Baliza", "São Luiz", "Caroebe", "Rorainópolis"],

  "SC - Santa Catarina": ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Lages", "Palhoça", "Balneário Camboriú", "Jaraguá do Sul", "Brusque", "Tubarão", "São Bento do Sul", "Concórdia", "Camboriú", "Navegantes", "Caçador", "Tijucas", "Rio do Sul", "Araranguá", "Biguaçu", "Gaspar", "Itapema", "Içara", "Canoinhas", "Indaial", "Mafra", "Videira", "Xanxerê", "Orleans", "São Francisco do Sul", "Fraiburgo", "Herval d'Oeste", "Imbituba", "Urussanga", "Laguna", "Porto União", "Braço do Norte", "Campos Novos", "Balneário Piçarras", "Curitibanos", "Timbó", "Bombinhas", "Sombrio", "São Joaquim", "Guaramirim", "Joaçaba", "Taió", "Capivari de Baixo", "Schroeder", "Forquilhinha", "Rio Negrinho", "São Lourenço do Oeste", "Santo Amaro da Imperatriz", "Jardinópolis", "Turvo", "Guabiruba", "Pomerode", "Ibirama", "São Miguel do Oeste", "Presidente Getúlio", "Guarujá do Sul", "Itaiópolis", "Seara", "Penha", "Papanduva", "São João Batista", "Massaranduba", "Itapiranga", "Nova Veneza", "Maravilha", "São José do Cedro", "Capinzal", "Lebon Régis", "Corupá", "Ituporanga", "Dionísio Cerqueira", "Três Barras", "Porto Belo", "Ilhota", "Coronel Freitas", "Morro da Fumaça", "São Ludgero", "Siderópolis", "Rio dos Cedros", "Paraíso", "Campo Erê", "Ascurra", "Jaguaruna", "São Carlos", "Balneário Arroio do Silva", "Balneário Gaivota", "Garopaba", "Navegantes", "Itajaí", "Balneário Piçarras", "Penha", "Barra Velha", "São João do Itaperiú", "Araquari", "Balneário Barra do Sul", "São Francisco do Sul", "Joinville", "Garuva", "Itapoá", "Schroeder", "Guaramirim", "Jaraguá do Sul", "Massaranduba", "São João Batista", "Canelinha", "Tijucas", "Governador Celso Ramos", "Biguaçu", "Antônio Carlos", "São José", "Palhoça", "Santo Amaro da Imperatriz", "Águas Mornas", "São Pedro de Alcântara", "Florianópolis", "Paulo Lopes", "Garopaba", "Imbituba", "Laguna", "Jaguaruna", "Sangão", "Tubarão", "Treze de Maio", "Pedras Grandes", "Orleans", "Urussanga", "Lauro Müller", "Treviso", "Siderópolis", "Nova Veneza", "Criciúma", "Cocal do Sul", "Morro da Fumaça", "Içara", "Balneário Rincão", "Araranguá", "Balneário Arroio do Silva", "Maracajá", "Meleiro", "Morro Grande", "Nova Veneza", "Sombrio", "Balneário Gaivota", "Santa Rosa do Sul", "São João do Sul", "Passo de Torres", "Praia Grande", "Jacinto Machado", "Ermo", "Turvo", "Timbé do Sul", "Araranguá", "Balneário Arroio do Silva", "Maracajá", "Meleiro", "Morro Grande", "Nova Veneza", "Sombrio", "Balneário Gaivota", "Santa Rosa do Sul", "São João do Sul", "Passo de Torres", "Praia Grande", "Jacinto Machado", "Ermo", "Turvo", "Timbé do Sul", "Criciúma", "Forquilhinha", "Nova Veneza", "Içara", "Balneário Rincão", "Araranguá", "Balneário Arroio do Silva", "Maracajá", "Meleiro", "Morro Grande", "Sombrio", "Balneário Gaivota", "Santa Rosa do Sul", "São João do Sul", "Passo de Torres", "Praia Grande", "Jacinto Machado", "Ermo", "Turvo", "Timbé do Sul", "Urussanga", "Cocal do Sul", "Morro da Fumaça", "Içara", "Balneário Rincão", "Criciúma", "Forquilhinha", "Nova Veneza", "Siderópolis", "Treviso", "Lauro Müller", "Orleans", "São Ludgero", "Gravatal", "Armazém", "Braço do Norte", "Grão Pará", "Rio Fortuna", "Santa Rosa de Lima", "Anitápolis", "Rancho Queimado", "Alfredo Wagner", "Bom Retiro", "São Joaquim", "Urupema", "Painel", "Rio Rufino", "Urubici", "Bocaina do Sul", "Lages", "Correia Pinto", "São José do Cerrito", "Campo Belo do Sul", "Capão Alto", "Cerro Negro", "Anita Garibaldi", "Abdon Batista", "Vargem", "Brunópolis", "Curitibanos", "Ponte Alta", "São Cristóvão do Sul", "Ponte Alta do Norte", "Frei Rogério", "Monte Carlo", "Celso Ramos", "Campos Novos", "Zortéa", "Capinzal", "Ouro", "Herval d'Oeste", "Joaçaba", "Lacerdópolis", "Erval Velho", "Vargem Bonita", "Catanduvas", "Água Doce", "Irani", "Ponte Serrada", "Passos Maia", "Vargeão", "Faxinal dos Guedes", "Xanxerê", "Bom Jesus", "Abelardo Luz", "São Domingos", "Ipuaçu", "Entre Rios", "Lajeado Grande", "Marema", "Xaxim", "Arroio Trinta", "Salto Veloso", "Treze Tílias", "Ibicaré", "Luzerna", "Água Doce", "Catanduvas", "Vargem Bonita", "Irani", "Jaborá", "Presidente Castelo Branco", "Peritiba", "Piratuba", "Ipira", "Alto Bela Vista", "Concórdia", "Arabutã", "Lindóia do Sul", "Itá", "Paial", "Seara", "Xavantina", "Arvoredo", "Chapecó", "Guatambu", "Caxambu do Sul", "Planalto Alegre", "Nova Itaberaba", "Coronel Freitas", "Águas Frias", "União do Oeste", "Jardinópolis", "Irati", "Quilombo", "Formosa do Sul", "Santiago do Sul", "Coronel Martins", "Novo Horizonte", "Galvão", "Jupiá", "São Bernardino", "São Lourenço do Oeste", "Campo Erê", "Saltinho", "Santa Terezinha do Progresso", "Tigrinhos", "Flor do Sertão", "Bandeirante", "Belmonte", "Santa Helena", "Tunápolis", "Iporã do Oeste", "Mondaí", "Caibi", "Riqueza", "Palmitos", "Anchieta", "São Miguel do Oeste", "Descanso", "Barra Bonita", "Romelândia", "Guaraciaba", "São José do Cedro", "Princesa", "Guarujá do Sul", "Dionísio Cerqueira", "Palma Sola"],

  "SP - São Paulo": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José dos Campos", "Mogi das Cruzes", "Diadema", "Jundiaí", "Carapicuíba", "Piracicaba", "Bauru", "Itaquaquecetuba", "Franca", "São Vicente", "Guarujá", "Praia Grande", "Taubaté", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "São José do Rio Preto", "Cotia", "Indaiatuba", "Americana", "São Carlos", "Jacareí", "Marília", "Araraquara", "Rio Claro", "Santa Bárbara d'Oeste", "Presidente Prudente", "Ferraz de Vasconcelos", "Francisco Morato", "Itapecerica da Serra", "Hortolândia", "São Caetano do Sul", "Jaú", "Mogi Guaçu", "Bragança Paulista", "Araçatuba", "Itapevi", "Pindamonhangaba", "Poá", "Franco da Rocha", "Atibaia", "Botucatu", "Valinhos", "Guaratinguetá", "Salto", "Birigui", "Votorantim", "Itapetininga", "Caraguatatuba", "Catanduva", "Araras", "Cubatão", "Barretos", "Mogi Mirim", "Itanhaém", "Ubatuba", "Ribeirão Pires", "Ourinhos", "Araçoiaba da Serra", "Assis", "Jandira", "Santana de Parnaíba", "São João da Boa Vista", "Votuporanga", "Várzea Paulista", "Itapecerica da Serra", "Campos do Jordão", "Embu-Guaçu", "Águas de Lindóia", "Adamantina", "Cruzeiro", "Suzano", "Ferraz de Vasconcelos", "Poá", "Itaquaquecetuba", "Arujá", "Guarulhos", "Santa Isabel", "Mairiporã", "Cajamar", "Franco da Rocha", "Caieiras", "Francisco Morato", "Campo Limpo Paulista", "Várzea Paulista", "Jundiaí", "Jarinú", "Itatiba", "Morungaba", "Bragança Paulista", "Atibaia", "Bom Jesus dos Perdões", "Nazaré Paulista", "Piracaia", "Joanópolis", "Vargem", "Louveira", "Vinhedo", "Valinhos", "Campinas", "Paulínia", "Americana", "Nova Odessa", "Sumaré", "Hortolândia", "Monte Mor", "Elias Fausto", "Indaiatuba", "Salto", "Itu", "Porto Feliz", "Boituva", "Araçoiaba da Serra", "Sorocaba", "Votorantim", "Alumínio", "Mairinque", "São Roque", "Araçariguama", "Ibiúna", "Piedade", "Tapiraí", "Juquiá", "Miracatu", "Pedro de Toledo", "Itariri", "Peruíbe", "Itanhaém", "Mongaguá", "Praia Grande", "São Vicente", "Cubatão", "Santos", "Guarujá", "Bertioga", "Ilha Comprida", "Iguape", "Cananéia", "Pariquera-Açu", "Jacupiranga", "Cajati", "Registro", "Eldorado", "Sete Barras", "Juquiá", "Miracatu", "Pedro de Toledo", "Itariri", "Peruíbe", "Itanhaém", "Mongaguá", "Praia Grande", "São Vicente", "Cubatão", "Santos", "Guarujá", "Bertioga", "São Sebastião", "Ilhabela", "Caraguatatuba", "Ubatuba", "Paraty", "Cunha", "São Luiz do Paraitinga", "Lagoinha", "Redenção da Serra", "Jambeiro", "Paraibuna", "Santa Branca", "Guararema", "Biritiba Mirim", "Salesópolis", "Mogi das Cruzes", "Suzano", "Poá", "Ferraz de Vasconcelos", "Itaquaquecetuba", "Arujá", "Guarulhos", "Santa Isabel", "Igaratá", "Jacareí", "São José dos Campos", "Caçapava", "Taubaté", "Tremembé", "Pindamonhangaba", "Roseira", "Aparecida", "Potim", "Guaratinguetá", "Lorena", "Cachoeira Paulista", "Cruzeiro", "Lavrinhas", "Queluz", "Areias", "São José do Barreiro", "Silveiras", "Bananal", "Arapeí", "Cunha", "São Luiz do Paraitinga", "Lagoinha", "Redenção da Serra", "Jambeiro", "Paraibuna", "Santa Branca", "Guararema", "Biritiba Mirim", "Salesópolis", "Mogi das Cruzes", "Suzano", "Poá", "Ferraz de Vasconcelos", "Itaquaquecetuba", "Arujá", "Guarulhos", "Santa Isabel", "Igaratá", "Jacareí", "São José dos Campos", "Caçapava", "Taubaté", "Tremembé", "Pindamonhangaba", "Roseira", "Aparecida", "Potim", "Guaratinguetá", "Lorena", "Cachoeira Paulista", "Cruzeiro", "Lavrinhas", "Queluz", "Areias", "São José do Barreiro"],

  "SE - Sergipe": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "São Cristóvão", "Simão Dias", "Capela", "Itabaianinha", "Poço Redondo", "Propriá", "Nossa Senhora da Glória", "Porto da Folha", "Boquim", "Laranjeiras", "Itaporanga d'Ajuda", "Nossa Senhora das Dores", "Campo do Brito", "Riachão do Dantas", "Ribeirópolis", "Neópolis", "Maruim", "Pacatuba", "São Domingos", "Frei Paulo", "Monte Alegre de Sergipe", "Malhador", "General Maynard", "Moita Bonita", "Areia Branca", "Arauá", "Canindé de São Francisco", "Gararu", "Barra dos Coqueiros", "Japaratuba", "Ilha das Flores", "Poço Verde", "Aquidabã", "Tomar do Geru", "Carmópolis", "Riachuelo", "Umbaúba", "Pirambu", "Muribeca", "Cristinápolis", "Pinhão", "Salgado", "Indiaroba", "Brejo Grande", "São Francisco", "Divina Pastora", "Nossa Senhora de Lourdes", "Pedrinhas", "Santo Amaro das Brotas", "Rosário do Catete", "Japoatã", "Amparo de São Francisco", "Santa Rosa de Lima", "Carira", "Santa Luzia do Itanhy", "Santana do São Francisco", "Siriri", "Cedro de São João", "Canhoba", "Cumbe", "Feira Nova", "Graccho Cardoso", "Itabi", "Macambira", "Malhada dos Bois", "Pedra Mole", "Telha", "São Miguel do Aleixo"],

  "TO - Tocantins": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Araguatins", "Formoso do Araguaia", "Dianópolis", "Taguatinga", "Augustinópolis", "Pedro Afonso", "Xambioá", "Colmeia", "Alvorada", "Arraias", "Paranã", "São Miguel do Tocantins", "Novo Acordo", "Ponte Alta do Tocantins", "Itacajá", "Lizarda", "Lagoa do Tocantins", "Rio Sono", "Santa Tereza do Tocantins", "Aparecida do Rio Negro", "Lajeado", "Tocantínia", "Pedro Afonso", "Tupirama", "Bom Jesus do Tocantins", "Santa Maria do Tocantins", "Guaraí", "Fortaleza do Tabocão", "Colmeia", "Pequizeiro", "Couto Magalhães", "Juarina", "Bernardo Sayão", "Presidente Kennedy", "Itaporã do Tocantins", "Araguacema", "Dois Irmãos do Tocantins", "Abreulândia", "Divinópolis do Tocantins", "Marianópolis do Tocantins", "Monte Santo do Tocantins", "Paraíso do Tocantins", "Pugmil", "Chapada de Areia", "Nova Rosalândia", "Oliveira de Fátima", "Fátima", "Crixás do Tocantins", "Pium", "Barrolândia", "Miranorte", "Rio dos Bois", "Miracema do Tocantins", "Porto Nacional", "Palmas", "Monte do Carmo", "Silvanópolis", "Santa Rosa do Tocantins", "Ipueiras", "Brejinho de Nazaré", "Porto Nacional", "Palmas", "Lajeado", "Aparecida do Rio Negro", "Novo Acordo", "Lagoa do Tocantins", "Santa Tereza do Tocantins", "Ponte Alta do Tocantins", "Mateiros", "Rio Sono", "Lizarda", "São Félix do Tocantins", "Rio Sono", "Lizarda", "Santa Tereza do Tocantins", "Lagoa do Tocantins", "Novo Acordo", "Aparecida do Rio Negro", "Lajeado", "Palmas", "Porto Nacional", "Silvanópolis", "Santa Rosa do Tocantins", "Natividade", "Chapada da Natividade", "São Valério da Natividade", "Pindorama do Tocantins", "Almas", "Dianópolis", "Novo Jardim", "Ponte Alta do Bom Jesus", "Taguatinga", "Aurora do Tocantins", "Lavandeira", "Combinado", "Novo Alegre", "Rio da Conceição", "Taipas do Tocantins", "Conceição do Tocantins", "Arraias", "Paranã", "São Salvador do Tocantins", "Jaú do Tocantins", "Palmeirópolis", "Peixe", "Gurupi", "Aliança do Tocantins", "Cariri do Tocantins", "Dueré", "Figueirópolis", "Sucupira", "Alvorada", "Talismã", "Araguaçu", "Sandolândia"]
};

export function PropertySimulatorCard({ data, setData }: PropertySimulatorCardProps) {
  const [cidadesFiltradas, setCidadesFiltradas] = useState<string[]>([]);
  const [searchCidade, setSearchCidade] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCurrencyDisplayValue = (value: string) => {
    if (!value) return '';
    const amount = parseFloat(value) / 100 || 0;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const updateData = (field: keyof PropertyData, value: string) => {
    const newData = { ...data, [field]: value };
    
    // Auto-calcular campos dependentes
    if (field === 'estado') {
      const estadoSigla = value.split(' - ')[0];
      setCidadesFiltradas(cidadesPorEstado[value as keyof typeof cidadesPorEstado] || []);
      newData.cidade = "";
      
      // Ajustar taxa de juros de acordo com o estado
      const taxasJurosPorEstado: {[key: string]: string} = {
        "AC": "12.5", "AL": "12.8", "AP": "12.7", "AM": "12.6", "BA": "11.2",
        "CE": "11.5", "DF": "10.3", "ES": "10.9", "GO": "10.9", "MA": "12.4",
        "MT": "11.1", "MS": "11.0", "MG": "10.8", "PA": "12.3", "PB": "12.1",
        "PR": "10.6", "PE": "11.8", "PI": "12.2", "RJ": "11.0", "RN": "12.0",
        "RS": "10.7", "RO": "12.4", "RR": "12.8", "SC": "10.4", "SP": "10.5",
        "SE": "12.0", "TO": "12.1"
      };
      newData.percentualJuros = taxasJurosPorEstado[estadoSigla] || "10.5";
    }
    
    // Auto-calcular entrada (20% do valor do imóvel)
    if (field === 'valorCompra') {
      const valorCompra = parseFloat(value.replace(/\D/g, '')) / 100 || 0;
      if (valorCompra > 0) {
        const entrada = valorCompra * 0.2;
        newData.valorEntrada = (entrada * 100).toString();
        const valorFinanciado = valorCompra - entrada;
        newData.valorFinanciado = (valorFinanciado * 100).toString();
      }
    }
    
    if (field === 'valorEntrada') {
      const valorCompra = parseFloat(newData.valorCompra.replace(/\D/g, '')) / 100 || 0;
      const valorEntrada = parseFloat(value.replace(/\D/g, '')) / 100 || 0;
      if (valorCompra > 0 && valorEntrada > 0) {
        const valorFinanciado = valorCompra - valorEntrada;
        newData.valorFinanciado = (valorFinanciado * 100).toString();
      }
    }

    // Cálculo automático de parcela ou prazo
    if (field === 'prazoFinanciamento' || field === 'percentualJuros' || field === 'valorFinanciado') {
      const valorFinanciado = parseFloat(newData.valorFinanciado) / 100 || 0;
      const juros = parseFloat(newData.percentualJuros) / 100 / 12 || 0;
      const prazo = parseFloat(newData.prazoFinanciamento) || 0;
      
      if (valorFinanciado > 0 && juros > 0 && prazo > 0) {
        const parcela = valorFinanciado * (juros * Math.pow(1 + juros, prazo)) / (Math.pow(1 + juros, prazo) - 1);
        newData.valorParcela = (parcela * 100).toString();
      }
    }

    if (field === 'valorParcela' && newData.valorFinanciado && newData.percentualJuros) {
      const valorFinanciado = parseFloat(newData.valorFinanciado) / 100 || 0;
      const juros = parseFloat(newData.percentualJuros) / 100 / 12 || 0;
      const parcela = parseFloat(newData.valorParcela.replace(/\D/g, '')) / 100 || 0;
      
      if (valorFinanciado > 0 && juros > 0 && parcela > 0) {
        try {
          const prazo = Math.log(parcela / (parcela - valorFinanciado * juros)) / Math.log(1 + juros);
          newData.prazoFinanciamento = Math.round(prazo).toString();
        } catch (e) {
          // Em caso de erro no cálculo logarítmico, mantemos o valor atual
          console.log("Erro no cálculo de prazo:", e);
        }
      }
    }
    
    setData(newData);
  };

  const handleCurrencyInput = (field: keyof PropertyData, value: string) => {
    updateData(field, value.replace(/\D/g, ''));
  };

  useEffect(() => {
    // Se tivermos um estado selecionado mas nenhuma cidade ainda, carregar as cidades
    if (data.estado && !data.cidade && cidadesFiltradas.length === 0) {
      setCidadesFiltradas(cidadesPorEstado[data.estado as keyof typeof cidadesPorEstado] || []);
    }
  }, [data.estado, data.cidade, cidadesFiltradas]);

  const cidadesFiltradas2 = cidadesFiltradas.filter(cidade => 
    cidade.toLowerCase().includes(searchCidade.toLowerCase())
  );

  const valorCompraNum = parseFloat(data.valorCompra) / 100 || 0;
  const valorEntradaNum = parseFloat(data.valorEntrada) / 100 || 0;
  const valorFinanciadoNum = parseFloat(data.valorFinanciado) / 100 || 0;
  const parcelaNum = parseFloat(data.valorParcela) / 100 || 0;
  const prazoFinanciamento = parseFloat(data.prazoFinanciamento) || 0;
  const totalJurosFinanciamento = prazoFinanciamento > 0 ? (parcelaNum * prazoFinanciamento) - valorFinanciadoNum : 0;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-foreground">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-primary-foreground" />
          </div>
          Simulador de <span className="text-yellow-primary">Investimentos</span> Imobiliários
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-foreground font-medium">Estado</Label>
            <Select value={data.estado} onValueChange={(value) => updateData('estado', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosBrasil.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-foreground font-medium">Cidade</Label>
            <Select value={data.cidade} onValueChange={(value) => updateData('cidade', value)} disabled={!data.estado}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Digite para buscar..."
                    value={searchCidade}
                    onChange={(e) => setSearchCidade(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {cidadesFiltradas2.length > 0 ? (
                  cidadesFiltradas2.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-muted-foreground">
                    Nenhuma cidade encontrada
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-foreground font-medium">Tipo</Label>
            <Select value={data.tipo} onValueChange={(value) => updateData('tipo', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residencial">Residencial</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalidade" className="text-foreground font-medium">Finalidade</Label>
            <Select value={data.finalidade} onValueChange={(value) => updateData('finalidade', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione a finalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenda">Revenda</SelectItem>
                <SelectItem value="aluguel">Aluguel</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorCompra" className="text-foreground font-medium">Valor de Compra (R$)</Label>
            <Input
              id="valorCompra"
              type="text"
              placeholder="350.000,00"
              value={getCurrencyDisplayValue(data.valorCompra)}
              onChange={(e) => handleCurrencyInput('valorCompra', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="financiamento" className="text-foreground font-medium">Financiamento</Label>
            <Select value={data.financiamento} onValueChange={(value) => updateData('financiamento', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Sim/Não" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.financiamento === 'sim' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valorEntrada" className="text-foreground font-medium">
                  Valor da Entrada (R$)
                  <span className="text-xs text-muted-foreground block">Padrão: 20% - Financiamentos exigem mín. 20% do valor</span>
                </Label>
                <Input
                  id="valorEntrada"
                  type="text"
                  placeholder="70.000,00"
                  value={getCurrencyDisplayValue(data.valorEntrada)}
                  onChange={(e) => handleCurrencyInput('valorEntrada', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Valor Financiado (R$)</Label>
                <Input
                  value={getCurrencyDisplayValue(data.valorFinanciado)}
                  readOnly
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentualJuros" className="text-foreground font-medium">
                  Juros do Financiamento (% a.a.)
                </Label>
                <Input
                  id="percentualJuros"
                  type="number"
                  step="0.1"
                  value={data.percentualJuros}
                  onChange={(e) => updateData('percentualJuros', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazoFinanciamento" className="text-foreground font-medium">Prazo (meses)</Label>
                <Input
                  id="prazoFinanciamento"
                  type="number"
                  placeholder="360"
                  value={data.prazoFinanciamento}
                  onChange={(e) => updateData('prazoFinanciamento', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorParcela" className="text-foreground font-medium">Valor da Parcela (R$)</Label>
                <Input
                  id="valorParcela"
                  type="text"
                  placeholder="2.500,00"
                  value={getCurrencyDisplayValue(data.valorParcela)}
                  onChange={(e) => handleCurrencyInput('valorParcela', e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="taxaCartorio" className="text-foreground font-medium">Taxa Cartório/ITBI (%)</Label>
            <Input
              id="taxaCartorio"
              type="number"
              step="0.1"
              value={data.taxaCartorio}
              onChange={(e) => updateData('taxaCartorio', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reformaMobilia" className="text-foreground font-medium">Reforma/Mobília (R$) - Opcional</Label>
            <Input
              id="reformaMobilia"
              type="text"
              placeholder="0,00"
              value={getCurrencyDisplayValue(data.reformaMobilia)}
              onChange={(e) => handleCurrencyInput('reformaMobilia', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outrasDespesas" className="text-foreground font-medium">Outras Despesas (R$) - Opcional</Label>
            <Input
              id="outrasDespesas"
              type="text"
              placeholder="0,00"
              value={getCurrencyDisplayValue(data.outrasDespesas)}
              onChange={(e) => handleCurrencyInput('outrasDespesas', e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-4 p-3 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold text-foreground mb-3">Resumo Financeiro</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Valor de Compra:</span>
              <p className="font-semibold text-yellow-primary">{formatCurrency(valorCompraNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Valor Financiado:</span>
              <p className="font-semibold text-accent">{formatCurrency(valorFinanciadoNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Entrada:</span>
              <p className="font-semibold text-yellow-primary">{formatCurrency(valorEntradaNum)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Parcela Mensal:</span>
              <p className="font-semibold text-accent">{formatCurrency(parcelaNum)}</p>
            </div>
          </div>
          {prazoFinanciamento > 0 && data.financiamento === 'sim' && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Total de Juros:</span>
                <p className="font-semibold text-red-highlight">{formatCurrency(totalJurosFinanciamento)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Financiado:</span>
                <p className="font-semibold text-accent">{formatCurrency(parcelaNum * prazoFinanciamento)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
