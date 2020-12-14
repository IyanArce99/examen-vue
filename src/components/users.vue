<template>
  <div class="container">
    <h1>Exámen práctico</h1>
    <select
      v-if="regions.length > 0"
      @change="changeCountry($event)"
    >
      <option value="All">Todos</option>
      <option v-for="region in regions" :value="region" :key="region">
        {{ region }}
      </option>
    </select>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Apellido</th>
          <th scope="col">Edad</th>
          <th scope="col">Altura</th>
          <th scope="col">Peso</th>
          <th scope="col">País</th>
          <th scope="col">Estudios</th>
          <th scope="col">Sexo</th>
          <th scope="col">Grupo Sanguíneo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in people" :key="user.uid">
          <th scope="row">{{ user.uid }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.surname1 }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.height }}</td>
          <td>{{ user.weight }}</td>
          <td>
            {{
              user.country && user.country.countryName
                ? user.country.countryName
                : "-"
            }}
          </td>
          <td>{{ user.studies ? user.studies : "-" }}</td>
          <td>{{ user.gender ? user.gender : "-" }}</td>
          <td>{{ user.bloodType }}</td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col-12 mt-5">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Total Años</th>
              <th scope="col">Menor edad</th>
              <th scope="col">Mayor edad</th>
              <th scope="col">Más jóven</th>
              <th scope="col">Más anciano</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ totalYears }}</td>
              <td>{{ this.smallestAge }}</td>
              <td>{{ this.biggestAge }}</td>
              <td>{{ this.jounger }}</td>
              <td>{{ this.older }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-4">
        <h2>Hora UTC</h2>
        <span>{{ utcHour }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";

export default {
  name: "Users",
  props: {},
  data: function () {
    return {
      people: [],
      allPeople: [],
      regions: [],
      totalYears: 0,
      smallestAge: 0,
      biggestAge: 0,
      older: "",
      jounger: "",
      webservice_data: {
        people: [
          {
            uid: "1",
            name: "Andrés",
            surname1: "Gómez",
            age: 10,
            height: 180,
            weight: 75,
          },
          {
            uid: "2",
            name: "María",
            surname1: "Martínez",
            age: 40,
            height: 165,
            weight: 55,
          },
          {
            uid: "3",
            name: "Juan",
            surname1: "Palacios",
            age: 85,
            height: 160,
            weight: 70,
          },
          {
            uid: "4",
            name: "Marta",
            surname1: "Domingo",
            age: 25,
            height: 180,
            weight: 70,
          },
          {
            uid: "5",
            name: "Fausta",
            surname1: "Sanz",
            age: 55,
            height: 155,
            weight: 45,
          },
        ],
        countries: [
          { id: "1", countryName: "España", region: "Europa" },
          { id: "2", countryName: "Francia", region: "Europa" },
          { id: "3", countryName: "Colombia", region: "America" },
          { id: "4", countryName: "Japón", region: "Asia" },
        ],
        studies: [
          { id: "1", level: "Universidad" },
          { id: "2", level: "Instituto" },
        ],
        gender: [
          { id: "1", type: "Hombre" },
          { id: "2", type: "Mujer" },
        ],
        bloodType: [
          { id: "1", bloodName: "A" },
          { id: "2", bloodName: "B" },
          { id: "3", bloodName: "AB" },
          { id: "4", bloodName: "O" },
        ],
      },
    };
  },
  methods: {
    changeCountry: function (region) {
      const value = region.target.value;
      if (value === "All") {
        this.people = this.allPeople;
        return;
      }
      this.people = this.allPeople.filter(
        (person) => person.country && person.country.region === value
      );
    },
    createObject: function () {
      const self = this;
      const people = this.webservice_data.people.reduce((people, person) => {
        let country = self.webservice_data.countries.find(
          (country) => country.id === person.uid
        );

        if (country && !this.regions.includes(country.region)) {
          this.regions.push(country.region);
        }
        let studies = self.webservice_data.studies.find(
          (s) => s.id === person.uid
        );

        let gender = self.webservice_data.gender.find(
          (g) => g.id === person.uid
        );
        let bloodType = self.webservice_data.bloodType.find(
          (b) => b.id === person.uid
        );
        if (studies) {
          studies = studies.level;
        }

        if (gender) {
          gender = gender.type;
        }
        if (bloodType) {
          bloodType = bloodType.bloodName;
        }
        const newPerson = { ...person, country, studies, gender, bloodType };
        people.push(newPerson);
        this.allPeople = people;
        return people;
      }, []);

      return people;
    },
    calculateAge: function () {
      this.smallestAge = this.webservice_data.people[0].age;
      this.totalYears = this.webservice_data.people.reduce(
        (total, p) => (total += p.age),
        0
      );
      this.webservice_data.people.forEach((person) => {
        if (person.age > this.biggestAge) {
          this.biggestAge = person.age;
          this.older = person.name;
        }

        if (person.age <= this.smallestAge) {
          this.smallestAge = person.age;
          this.jounger = person.name;
        }
      });
    },
  },
  computed: {
    utcHour: function () {
      return moment().format("HH:mm:ss");
    },
  },
  mounted() {
    this.people = this.createObject();
    this.calculateAge();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
