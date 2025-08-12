(function(root) {

    let globalSteps = 0;

    const getPixel = (img, {x, y}) => {
      const i = (y * img.width + x) * 4;
      return img.data.subarray(i, i + 4);
    },

    setPixel = (img, {x, y}, color) => {
      const i = (y * img.width + x) * 4 ;
      img.data.set(color, i);
    },

    wait = async (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

    ALPHA_DELETE_THRESHOLD = 244,
    MAX_WIDTH_LIMIT = 1500,
    MAX_HEIGHT_LIMIT = 1500,

    imgMatrix = (w, h, filler) => new Array(h).fill(null).map(() => new Array(w).fill(filler));

    const getPixelEnergy = (left, middle, right) => {
      const [mR, mG, mB, mA] = middle;
      let lEnergy = 0, rEnergy = 0;
      if (left) {
        const [lR, lG, lB] = left;
        lEnergy = (lR - mR) ** 2 + (lG - mG) ** 2 + (lB - mB) ** 2;
      }
      if (right) {
        const [rR, rG, rB] = right;
        rEnergy = (rR - mR) ** 2 + (rG - mG) ** 2 + (rB - mB) ** 2;
      }
      return mA > ALPHA_DELETE_THRESHOLD ? (lEnergy + rEnergy) : -1170450000;
      //return Math.sqrt(lEnergy + rEnergy);
    };

    const iterationCallback = (step) => parseInt(100 / globalSteps * step);

    const getPixelEnergyH = (img, {w}, {x, y}) => {
      const left = (x - 1) >= 0 ? getPixel(img, {x: x - 1, y}) : null;
      const middle = getPixel(img, {x, y});
      const right = (x + 1) < w ? getPixel(img, {x: x + 1, y}) : null;
      return getPixelEnergy(left, middle, right);
    };

    const getPixelEnergyV = (img, {h}, {x, y}) => {
      const top = (y - 1) >= 0 ? getPixel(img, {x, y: y - 1}) : null;
      const middle = getPixel(img, {x, y});
      const bottom = (y + 1) < h ? getPixel(img, {x, y: y + 1}) : null;
      return getPixelEnergy(top, middle, bottom);
    };

    const calculateEnergyMapH = (img, {w, h}) => {
      const energyMap = imgMatrix(w, h, Infinity);
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) energyMap[y][x] = getPixelEnergyH(img, {w, h}, {x, y});
      }
      return energyMap;
    };

    const calculateEnergyMapV = (img, {w, h}) => {
      const energyMap = imgMatrix(w, h, Infinity);
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) energyMap[y][x] = getPixelEnergyV(img, {w, h}, {x, y});
      }
      return energyMap;
    };

    const reCalculateEnergyMapH = (img, {w, h}, energyMap, seam) => {
      seam.forEach(({x: seamX, y: seamY}) => {
        // Deleting the seam from the energy map.
        for (let x = seamX; x < (w - 1); x += 1) energyMap[seamY][x] = energyMap[seamY][x + 1];
        // Recalculating the energy pixels around the deleted seam.
        energyMap[seamY][seamX] = getPixelEnergyH(img, {w, h}, {x: seamX, y: seamY});
      });
      return energyMap;
    };

    const reCalculateEnergyMapV = (img, {w, h}, energyMap, seam) => {
      seam.forEach(({x: seamX, y: seamY}) => {
        // Deleting the seam from the energy map.
        for (let y = seamY; y < (h - 1); y += 1) energyMap[y][seamX] = energyMap[y + 1][seamX];
        // Recalculating the energy pixels around the deleted seam.
        energyMap[seamY][seamX] = getPixelEnergyV(img, {w, h}, {x: seamX, y: seamY});
      });
      return energyMap;
    };

    const findLowEnergySeamH = (energyMap, {w, h}) => {
      const seamsMap = imgMatrix(w, h, null);
      // Populate the first row of the map.
      for (let x = 0; x < w; x += 1) {
        const y = 0;
        seamsMap[y][x] = {
          energy: energyMap[y][x],
          coordinate: { x, y },
          previous: null
        };
      }
      // Populate the rest of the rows.
      for (let y = 1; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          // Find top adjacent cell with minimum energy.
          let minPrevEnergy = Infinity;
          let minPrevX = x;
          for (let i = (x - 1); i <= (x + 1); i += 1) {
            if (i >= 0 && i < w && seamsMap[y - 1][i].energy < minPrevEnergy) {
              minPrevEnergy = seamsMap[y - 1][i].energy;
              minPrevX = i;
            }
          }
          // Update the current cell.
          seamsMap[y][x] = {
            energy: minPrevEnergy + energyMap[y][x],
            coordinate: { x, y },
            previous: {x: minPrevX, y: y - 1},
          };
        }
      }
      // Find where the minimum energy seam ends.
      let lastMinCoordinate = null;
      let minSeamEnergy = Infinity;
      for (let x = 0; x < w; x += 1) {
        const y = h - 1;
        if (seamsMap[y][x].energy < minSeamEnergy) {
          minSeamEnergy = seamsMap[y][x].energy;
          lastMinCoordinate = {x, y};
        }
      }
      // Find the minimal energy seam.
      const seam = [];
      if (!lastMinCoordinate) return seam;
      const {x: lastMinX, y: lastMinY} = lastMinCoordinate;
      let currentSeam = seamsMap[lastMinY][lastMinX];
      while (currentSeam) {
        seam.push(currentSeam.coordinate);
        const prevMinCoordinates = currentSeam.previous;
        if (!prevMinCoordinates) currentSeam = null;
        else {
          const {x: prevMinX, y: prevMinY} = prevMinCoordinates;
          currentSeam = seamsMap[prevMinY][prevMinX];
        }
      }
      return seam;
    };
    const findLowEnergySeamV = (energyMap, {w, h}) => {
      const seamsMap = imgMatrix(w, h, null);
      // Populate the first column of the map.
      for (let y = 0; y < h; y += 1) {
        const x = 0;
        seamsMap[y][x] = {
          energy: energyMap[y][x],
          coordinate: {x, y},
          previous: null
        };
      }
      // Populate the rest of the columns.
      for (let x = 1; x < w; x += 1) {
        for (let y = 0; y < h; y += 1) {
          // Find left adjacent cell with minimum energy.
          let minPrevEnergy = Infinity;
          let minPrevY = y;
          for (let i = (y - 1); i <= (y + 1); i += 1) {
            if (i >= 0 && i < h && seamsMap[i][x - 1].energy < minPrevEnergy) {
              minPrevEnergy = seamsMap[i][x - 1].energy;
              minPrevY = i;
            }
          }

          // Update the current cell.
          seamsMap[y][x] = {
            energy: minPrevEnergy + energyMap[y][x],
            coordinate: {x, y},
            previous: {x: x - 1, y: minPrevY}
          };
        }
      }
      // Find where the minimum energy seam ends.
      let lastMinCoordinate = null;
      let minSeamEnergy = Infinity;
      for (let y = 0; y < h; y += 1) {
        const x = w - 1;
        if (seamsMap[y][x].energy < minSeamEnergy) {
          // @ts-ignore
          minSeamEnergy = seamsMap[y][x].energy;
          lastMinCoordinate = {x, y};
        }
      }
      // Find the minimal energy seam.
      const seam = [];
      if (!lastMinCoordinate) return seam;
      const { x: lastMinX, y: lastMinY } = lastMinCoordinate;
      let currentSeam = seamsMap[lastMinY][lastMinX];
      while (currentSeam) {
        seam.push(currentSeam.coordinate);
        const prevMinCoordinates = currentSeam.previous;
        if (!prevMinCoordinates) currentSeam = null;
        else {
          const {x: prevMinX, y: prevMinY} = prevMinCoordinates;
          currentSeam = seamsMap[prevMinY][prevMinX];
        }
      }
      return seam;
    };

    const deleteSeamH = (img, seam, {w}) => {
      seam.forEach(({x: seamX, y: seamY}) => {
        for (let x = seamX; x < (w - 1); x += 1) {
          const nextPixel = getPixel(img, {x: x + 1, y: seamY});
          setPixel(img, {x, y: seamY}, nextPixel);
        }
      });
    };

    const deleteSeamV = (img, seam, {h}) => {
      seam.forEach(({x: seamX, y: seamY}) => {
        for (let y = seamY; y < (h - 1); y += 1) {
          const nextPixel = getPixel(img, {x: seamX, y: y + 1});
          setPixel(img, {x: seamX, y}, nextPixel);
        }
      });
    };


    const resizeImageWidth = async (args) => {
      const {img, toSize, onIteration, size, no} = args;
      const pxToRemove = img.width - toSize;
      const iterationLoop = async ({img, onIteration, energyMap, current}) => {
          const processed = Math.ceil(100 / globalSteps * current);
          await onIteration({img, energyMap, processed});
      };
      let energyMap = null;
      let seam = null;
      for (let i = 0; i < pxToRemove; i++) {
        energyMap = energyMap && seam ? reCalculateEnergyMapH(img, size, energyMap, seam) : calculateEnergyMapH(img, size);
        seam = findLowEnergySeamH(energyMap, size);
        deleteSeamH(img, seam, size);
        if (onIteration) await iterationLoop({img, onIteration, energyMap, current: i + no});
        size.w--;
        await wait(1);
      }
    };

    const resizeImageHeight = async (args) => {
      const {img, toSize, onIteration, size, no} = args;
      const pxToRemove = img.height - toSize;
      const iterationLoop = async ({img, onIteration, energyMap, current}) => {
          const processed = Math.ceil(100 / globalSteps * current);
          await onIteration({img, energyMap, processed});
      };
      let energyMap = null;
      let seam = null;
      for (let i = 0; i < pxToRemove; i++) {
        energyMap = energyMap && seam ? reCalculateEnergyMapV(img, size, energyMap, seam) : calculateEnergyMapV(img, size);
        seam = findLowEnergySeamV(energyMap, size);
        deleteSeamV(img, seam, size);
        if (onIteration) await iterationLoop({img, onIteration, energyMap, current: i + no});
        size.h--;
        await wait(1);
      }
    };

    const resizeImage = async (args) => {
        let {img, toWidth, toHeight, onIteration} = args;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const pxToRemoveH = img.width - toWidth;
        const pxToRemoveV = img.height - toHeight;
        const size = {w: img.width, h: img.height};
        globalSteps = pxToRemoveH + pxToRemoveV;
        await resizeImageWidth({img, toSize: toWidth, onIteration, size, no: 0});
        await resizeImageHeight({img, toSize: toHeight, onIteration, size, no: pxToRemoveH});
        canvas.width = toWidth;
        canvas.height = toHeight;
        ctx.putImageData(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    },

    awareResize = (opts, callback) => {
        let {img, canvas, toSize, onIteration} = opts;
        canvas = canvas || document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        !canvas.width && img && (canvas.width = img.width);
        !canvas.height && img && (canvas.height = img.height);
        img && (img.attributes?.src ? ctx.drawImage(img, 0, 0, img.width, img.height) : ctx.putImageData(img, 0, 0));
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resizeImage({img: data, toWidth: toSize[0], toHeight: toSize[1], onIteration}).then(e => callback && callback(e));
    };

    root.awareResize = awareResize;
}(globalThis));
