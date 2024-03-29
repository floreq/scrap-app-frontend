import { newChartLabeling } from "./newChartLabeling";

// Important! correctDateFormat jest potrzebny do ustalenia kolejnosci czasowej
// chartDataLinearGenerator generuje wartosci zalezne od siebie, np. wczoraj w magazynie bylo 10 dzisaij przybylo 13, czyli dzisiaj jest 23
// chartDataLinearGenerator potrzebuje czterech wartosci:
// v (array) - tablica z danymi, actualValue (number) - aktualny stan magazynu, nameTag (string) - nazwa wykresu, numberOfLabels (number) - ilosc etykiet
export const chartDataLinearGenerator = (
  v,
  vName,
  actualValue,
  nameTag,
  numberOfLabels
) => {
  // Przyporzadkowanie danych do odpowiadajacej etykiety (np. dane z dnia 21.01.2019 odpowiadaja etykiecie 21.01.2019)
  let outcome = actualValue; // Przechowanie stanu magazynu w danym czasie
  let prevValue = 0; // Przechowanie ile w danym dniu jest materialu
  let prevDates = [];
  // Przyporzadkowanie danych do odpowiadajacej etykiety (np. dane z dnia 21.01.2019 odpowiadaja etykiecie 21.01.2019)
  // Znany calkowity stan magazynu i ilosc materialu "zakuiponego" w dany dzien.
  // Odejmowanie od calkowietego stanu magazynu i ilosci materialu
  const returnDataCorrespondingToLabeling = newChartLabeling(numberOfLabels)[1]
    .reverse()
    .map(e => {
      if (!prevDates.includes(e)) {
        const filteredV = v.filter(lookingDate => {
          return lookingDate.actionDate === e;
        });

        if (filteredV.length === 0) {
          outcome -= prevValue;
          prevValue = 0;
        } else {
          outcome -= prevValue;
          prevValue = filteredV[0][vName];
        }
      }
      prevDates.push(e); // Dodanie przefiltrowanej daty
      return outcome;
    });

  // Zwrocenie danych do wykresu
  const data = {
    labels: newChartLabeling(numberOfLabels)[0],
    datasets: [
      {
        label: nameTag,
        backgroundColor: "#e0fbfc",
        borderColor: "#98c1d9",
        data: returnDataCorrespondingToLabeling.reverse()
      }
    ]
  };
  return data;
};

// chartDataGenerator potrzebuje czterech wartosci:
// v (array) - tablica z danymi, vName (string) - informacji jakiego obiektu szukac, nameTag (string) - nazwa wykresu,
// numberOfLabels (object) - ilosc etykiet, additionalStyling (object) - opcjonalne, typeOfLables (number) - opcjonalne
export const chartDataGenerator = (
  v,
  vName,
  nameTag,
  numberOfLabels,
  additionalStyling,
  typeOfLables
) => {
  if (typeOfLables === undefined) {
    typeOfLables = 0;
  }
  const retriveCorrespondingLabeling = newChartLabeling(numberOfLabels)[
    typeOfLables + 1
  ].reverse();
  // Przyporzadkowanie danych do odpowiadajacej etykiety (np. dane z dnia 21.01.2019 odpowiadaja etykiecie 21.01.2019)
  const returnDataCorrespondingToLabeling = retriveCorrespondingLabeling.map(
    e => {
      let outcome = 0;
      // Przypisywanie, mapowanie ilosci materialu do etykiet
      for (let i = 0; i < v.length; i++) {
        if (v[i].actionDate === e) {
          outcome = v[i][vName];
          break;
        }
      }
      return outcome;
    }
  );

  if (typeOfLables === undefined) {
    typeOfLables = 0;
  }

  // Zwrocenie danych do wykresu
  const data = {
    labels: newChartLabeling(numberOfLabels)[typeOfLables],
    datasets: [
      {
        label: nameTag,
        backgroundColor: "#e0fbfc",
        borderColor: "#98c1d9",
        data: returnDataCorrespondingToLabeling.reverse()
      }
    ]
  };

  // Dodanie dodatkowego stylu jezeli zostal podany
  if (additionalStyling !== undefined) {
    const merge = { ...data.datasets[0], ...additionalStyling };
    data.datasets[0] = merge;
  }
  return data;
};
