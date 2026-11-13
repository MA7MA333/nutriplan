interface SwalOptions {
  icon?: string;
  title?: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}

interface SwalResult {
  isConfirmed: boolean;
}

declare const Swal: {
  fire(options: SwalOptions): Promise<SwalResult>;
};

interface Ingredient {
  name?: string;
  measure?: string;
  ingredient?: string;
  strIngredient?: string;
  strMeasure?: string;
}

interface Meal {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  area: string;
  instructions: string[] | string;
  ingredients: Ingredient[];
  youtube?: string;
  source?: string;
}

interface Nutrients {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  saturatedFat?: number;
  saturated_fat?: number;
  sodium?: number;
  salt?: number;
}

interface Product {
  barcode: string;
  name: string;
  brand?: string;
  image?: string;
  nutritionGrade?: string;
  novaGroup?: number;
  nova_group?: number;
  nutrients?: Nutrients;
  ingredients?: string;
  allergens?: string | string[];
  product_name?: string;
  image_url?: string;
  brands?: string;
  nutriscore_grade?: string;
}

interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
}

interface Nutrition {
  perServing: NutritionValues;
  totals: NutritionValues;
}

interface MealsResponse {
  results?: Meal[];
}

interface MealResponse {
  result: Meal;
}

interface NutritionResponse {
  data: Nutrition;
}

interface ProductsResponse {
  results?: Product[];
  pagination?: {
    totalPages?: number;
    total_pages?: number;
    total?: number;
    limit?: number;
  };
}

interface ProductResponse {
  result: Product;
}

interface LogItem {
  id: string | number;
  type: string;
  name: string;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings?: number;
  createdAt: string;
}

class AppLoader {
  init() {
    window.addEventListener("load", () => {
      const overlay = document.getElementById("app-loading-overlay");
      console.log(document.getElementById("app-loading-overlay"));
      console.log(document.getElementById("app-loading-overlay")?.className);

      if (overlay) {
        overlay.classList.add("opacity-0");

        setTimeout(() => {
          overlay.style.display = "none";
        }, 500);
      }
    });
  }
}

class Navigation {
  navLinks: NodeListOf<HTMLElement>;
  targetSections: HTMLElement[];

  constructor() {
    this.navLinks = document.querySelectorAll<HTMLElement>(".nav-link");

    this.targetSections = [
      document.getElementById("meals-section") as HTMLElement,
      document.getElementById("products-section") as HTMLElement,
      document.getElementById("foodlog-section") as HTMLElement,
      mealDetails,
    ];
  }

  init() {
    const savedSection = localStorage.getItem("activeSection");

    if (savedSection) {
      this.targetSections.forEach((section) => {
        if (section.dataset.section === savedSection) {
          section.classList.remove("hidden");
        } else {
          section.classList.add("hidden");
        }
      });

      this.navLinks.forEach((link) => {
        if (link.dataset.section === savedSection) {
          link.classList.remove(
            "text-gray-600",
            "text-emerald-700",
            "text-emerald-600",
          );

          link.classList.add("bg-emerald-50", "text-emerald-600");
        } else {
          link.classList.remove(
            "bg-emerald-50",
            "text-emerald-600",
            "text-emerald-700",
          );

          link.classList.add("text-gray-600");
        }
      });
    }

    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetdata = link.dataset.section as string;

        localStorage.setItem("activeSection", targetdata);

        this.navLinks.forEach((item) => {
          if (item.dataset.section === targetdata) {
            item.classList.remove("text-gray-600", "text-emerald-700");

            item.classList.add("bg-emerald-50", "text-emerald-600");
          } else {
            item.classList.remove(
              "bg-emerald-50",
              "text-emerald-600",
              "text-emerald-700",
            );

            item.classList.add("text-gray-600");
          }
        });

        if (targetdata) {
          this.targetSections.forEach((section) => {
            if (section.dataset.section === targetdata) {
              section.classList.remove("hidden");
            } else {
              section.classList.add("hidden");
            }
          });
        }
      });
    });
  }
}

class Sidebar {
  init() {
    const headerBtn = document.querySelectorAll(".header-menu-btn");
    const closebtn = document.getElementById(
      "sidebar-close-btn",
    ) as HTMLElement;
    const sidebar = document.getElementById("side") as HTMLElement;
    const navLinks = document.querySelectorAll(".nav-link");

    headerBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        sidebar.style.transform = "translateX(0)";
      });
    });

    closebtn.addEventListener("click", () => {
      sidebar.style.transform = "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.style.transform = "";
      });
    });
  }
}

class MealsAPI {
  async getMeals(
    type: string,
    value: string = "",
  ): Promise<MealsResponse | null> {
    try {
      let url = "";

      if (type === "category") {
        const params = new URLSearchParams({
          category: value,
          page: "1",
          limit: "20",
        });
        url = `https://nutriplan-api.vercel.app/api/meals/filter?${params}`;
      } else if (type === "area") {
        const params = new URLSearchParams({
          area: value,
          page: "1",
          limit: "20",
        });
        url = `https://nutriplan-api.vercel.app/api/meals/filter?${params}`;
      } else if (type === "search") {
        const params = new URLSearchParams({
          q: value,
          page: "1",
          limit: "20",
        });
        url = `https://nutriplan-api.vercel.app/api/meals/search?${params}`;
      } else if (type === "random") {
        url = `https://nutriplan-api.vercel.app/api/meals/random?count=20`;
      } else {
        throw new Error("Invalid request type");
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch meals: ${response.status}`);
      }

      const data: MealsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  }

  async getMealById(id: string): Promise<Meal | null> {
    try {
      const response = await fetch(
        `https://nutriplan-api.vercel.app/api/meals/${id}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch meal: ${response.status}`);
      }

      const data: MealResponse = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async analyzeNutrition(
    recipeName: string,
    ingredients: Ingredient[],
  ): Promise<Nutrition | null> {
    try {
      const nutritionIngredients = ingredients.map((item) => {
        const name = item.name || item.ingredient || item.strIngredient || "";
        const measure = item.measure || item.strMeasure || "";
        return `${measure} ${name}`.trim();
      });

      const response = await fetch(
        "https://nutriplan-api.vercel.app/api/nutrition/analyze",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": "aywpGY0ETyO56uACal8ch060DKGd7qk9gTVybTSs",
          },
          body: JSON.stringify({
            recipeName: recipeName,
            ingredients: nutritionIngredients,
          }),
        },
      );

      const data: NutritionResponse = await response.json();
      if (!response.ok) {
        throw new Error(`Nutrition API Error: ${response.status}`);
      }

      return data.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
const mealsAPI = new MealsAPI();
const recipesGrid = document.getElementById("recipes-grid") as HTMLElement;
const mealsSection = document.getElementById("meals-section") as HTMLElement;
const mealDetails = document.getElementById("meal-details") as HTMLElement;
const recipesCount = document.getElementById("recipes-count") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const areaFilterButtons =
  document.querySelectorAll<HTMLElement>(".area-filter-btn");
const categoryCards = document.querySelectorAll<HTMLElement>(".category-card");

class RecipeRenderer {
  showData(data: Meal[] | { results?: Meal[] }) {
    const recipes = Array.isArray(data) ? data : data?.results || [];
    const cardsHTML = recipes
      .map((item: Meal) => {
        return `
          <div
            class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-meal-id="${item.id}"
          >
            <div class="clickImage relative h-48 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src="${item.thumbnail}"
                alt="${item.name}"
                loading="lazy"
              />
              <div class="absolute bottom-3 left-3 flex gap-2">
                <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                  ${item.category || "Unknown"}
                </span>
                <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                  ${item.area || "International"}
                </span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                ${item.name}
              </h3>
              <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                ${
                  Array.isArray(item.instructions)
                    ? item.instructions[0]
                    : item.instructions || "Delicious recipe to try!"
                }
              </p>
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-gray-900">
                  <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                  ${item.category || "Unknown"}
                </span>
                <span class="font-semibold text-gray-500">
                  <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                  ${item.area || "International"}
                </span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    recipesGrid.innerHTML =
      cardsHTML ||
      `
      <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fa-solid fa-magnifying-glass text-gray-400 text-xl"></i>
        </div>
        <p class="text-gray-600 text-lg font-medium max-w-xs leading-relaxed">
          No recipes found. Try a different search term.
        </p>
      </div>
      `;

    recipeDetailsManager.addMealClickEvents();
    recipesCount.textContent = `Showing ${recipes.length} recipes`;
  }
}

class RecipeManager {
  renderer: RecipeRenderer;
  api: MealsAPI;
  searchTimer: ReturnType<typeof setTimeout> | null;

  constructor(renderer: RecipeRenderer, api: MealsAPI) {
    this.renderer = renderer;
    this.api = api;
    this.searchTimer = null;
  }

  async loadMeals(type: string, value: string = "") {
    recipesGrid.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fa-solid fa-spinner fa-spin text-emerald-600 text-xl"></i>
        </div>
        <p class="text-gray-600 text-lg font-medium">
          Loading recipe...
        </p>
      </div>
    `;

    const data = await this.api.getMeals(type, value);

    if (!data) {
      recipesGrid.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-magnifying-glass text-gray-400 text-xl"></i>
          </div>
          <p class="text-gray-600 text-lg font-medium max-w-xs leading-relaxed">
            No recipes found. Try a different search term.
          </p>
        </div>
      `;
      recipesCount.textContent = "Showing 0 recipes";
      return;
    }

    this.renderer.showData(data);
  }

  areaFilter() {
    areaFilterButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const area = button.dataset.area;

        areaFilterButtons.forEach((btn) => {
          btn.classList.remove("active", "bg-emerald-600", "text-white");
          btn.classList.add("bg-gray-100", "text-gray-700");
        });

        button.classList.add("active", "bg-emerald-600", "text-white");
        button.classList.remove("bg-gray-100", "text-gray-700");

        if (area === "all") {
          await this.loadMeals("random");
          return;
        }

        await this.loadMeals("area", area);
      });
    });
  }

  categoryFilter() {
    categoryCards.forEach((card) => {
      card.addEventListener("click", async () => {
        const category = card.dataset.category;
        if (!category) return;
        await this.loadMeals("category", category);
      });
    });
  }

  search() {
    searchInput.addEventListener("input", () => {
      if (this.searchTimer) clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(async () => {
        const value = searchInput.value.trim();

        if (!value) {
          await this.loadMeals("random");
          return;
        }

        await this.loadMeals("search", value);
      }, 400);
    });
  }
}

class RecipeDetailsManager {
  api: MealsAPI;

  constructor(api: MealsAPI) {
    this.api = api;
  }

  showMealDetails(meal: Meal, nutrition: Nutrition | null) {
    let youtubeEmbedUrl = "";

    if (meal.youtube) {
      const videoIdMatch = meal.youtube.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
      );
      if (videoIdMatch) {
        youtubeEmbedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    }

    const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];

    const ingredientsHTML = ingredients
      .map((item) => {
        const name = item.name || item.ingredient || item.strIngredient || "";
        const measure = item.measure || item.strMeasure || "";

        return `
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
            <input
              type="checkbox"
              class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
            />
            <span class="text-gray-700">
              ${
                measure
                  ? `<span class="font-medium text-gray-900">${measure}</span>`
                  : ""
              }
              ${name}
            </span>
          </div>
        `;
      })
      .join("");

    let instructions: string[] = [];
    if (Array.isArray(meal.instructions)) {
      instructions = meal.instructions;
    } else if (typeof meal.instructions === "string") {
      instructions = meal.instructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0);
    }

    const instructionsHTML = instructions
      .map((step, index) => {
        return `
          <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              ${index + 1}
            </div>
            <p class="text-gray-700 leading-relaxed pt-2">
              ${step}
            </p>
          </div>
        `;
      })
      .join("");

    const categoryBadge = meal.category
      ? `<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>`
      : "";

    const areaBadge = meal.area
      ? `<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>`
      : "";

    const sourceHTML = meal.source
      ? `
        <a
          href="${meal.source}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
        >
          <i class="fa-solid fa-globe"></i>
          <span>View Source</span>
        </a>
      `
      : "";

    const videoHTML = youtubeEmbedUrl
      ? `
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-video text-red-500"></i>
            Video Tutorial
          </h2>
          <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
            <iframe
              src="${youtubeEmbedUrl}"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `
      : "";

    const nutritionHTML = nutrition
      ? `
        <div class="bg-white rounded-2xl shadow-lg p-5 sticky top-24">
          <div class="flex items-center gap-2 mb-2">
            <i class="fa-solid fa-chart-pie text-emerald-600"></i>
            <h2 class="text-base font-bold text-gray-900">Nutrition Facts</h2>
          </div>
          <p class="text-xs text-gray-500 mb-3">Per serving</p>

          <div class="bg-emerald-50 rounded-xl p-3 text-center mb-3">
            <p class="text-[10px] text-gray-600">Calories per serving</p>
            <p class="text-2xl font-bold text-emerald-600 leading-none">
              ${nutrition.perServing.calories}
            </p>
            <p class="text-[10px] text-gray-500 mt-1">
              Total: ${nutrition.totals.calories} cal
            </p>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Protein
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.protein}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" style="width: ${Math.min(nutrition.perServing.protein * 2.5, 100)}%"></div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                Carbs
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.carbs}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" style="width: ${Math.min(nutrition.perServing.carbs * 3, 100)}%"></div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                Fat
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.fat}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full" style="width: ${Math.min(nutrition.perServing.fat * 4, 100)}%"></div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                Fiber
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.fiber}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-orange-500 rounded-full" style="width: ${Math.min(nutrition.perServing.fiber * 10, 100)}%"></div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-pink-500"></span>
                Sugar
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.sugar}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-pink-500 rounded-full" style="width: ${Math.min(nutrition.perServing.sugar * 5, 100)}%"></div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="flex items-center gap-2 text-gray-700">
                <span class="w-2 h-2 rounded-full bg-red-500"></span>
                Saturated Fat
              </span>
              <span class="font-semibold text-gray-900">${nutrition.perServing.saturatedFat}g</span>
            </div>
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full" style="width: ${Math.min(nutrition.perServing.saturatedFat * 10, 100)}%"></div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <h3 class="text-xs font-semibold text-gray-700 mb-2">Other</h3>
            <div class="grid grid-cols-2 gap-3 text-[11px]">
              <div class="flex justify-between">
                <span class="text-gray-500">Cholesterol</span>
                <span class="font-medium text-gray-900">${nutrition.perServing.cholesterol}mg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Sodium</span>
                <span class="font-medium text-gray-900">${nutrition.perServing.sodium}mg</span>
              </div>
            </div>
          </div>
        </div>
      `
      : `
        <div class="bg-white rounded-2xl shadow-lg p-5">
          <h2 class="text-base font-bold text-gray-900 mb-2">Nutrition Facts</h2>
          <p class="text-sm text-gray-500">Nutrition information is not available.</p>
        </div>
      `;

    return `
      <header class="bg-white border-b border-gray-200 sticky top-0 w-full z-30">
        <div class="px-8 py-4">
          <div class="flex items-center gap-4">
            <button
              id="back-to-meals-btn"
              class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
            >
              <i class="fa-solid fa-arrow-left"></i>
              Back to Recipes
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-8 py-6">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-80 md:h-96">
            <img
              src="${meal.thumbnail || ""}"
              alt="${meal.name || "Recipe"}"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-3 mb-3">
                ${categoryBadge}
                ${areaBadge}
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                ${meal.name || "Untitled Recipe"}
              </h1>
              <div class="flex items-center gap-2 text-white/90">
                <i class="fa-solid fa-utensils"></i>
                ${ingredients.length} Ingredients
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 mb-8">
          <button
            id="log-meal-btn"
            data-meal-id="${meal.id || ""}"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            <i class="fa-solid fa-clipboard-list"></i>
            Log This Meal
          </button>
          ${sourceHTML}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-list-check text-emerald-600"></i>
                Ingredients
                <span class="text-sm font-normal text-gray-500 ml-auto">
                  ${ingredients.length} items
                </span>
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${ingredientsHTML || `<p class="text-gray-500">No ingredients available.</p>`}
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                Instructions
              </h2>
              <div class="space-y-4">
                ${instructionsHTML || `<p class="text-gray-500">No instructions available.</p>`}
              </div>
            </div>

            ${videoHTML}
          </div>

          <div class="space-y-6">
            ${nutritionHTML}
          </div>
        </div>
      </main>
    `;
  }

  addMealClickEvents() {
    const recipeCards = document.querySelectorAll<HTMLElement>(".recipe-card");

    recipeCards.forEach((card) => {
      card.addEventListener("click", async () => {
        mealsSection.classList.add("hidden");
        mealDetails.classList.remove("hidden");

        const mealId = card.dataset.mealId;
        if (!mealId) return;
        await this.loadDetails(mealId);
      });
    });
  }

  async loadDetails(mealId: string) {
    mealDetails.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fa-solid fa-spinner fa-spin text-emerald-600 text-xl"></i>
        </div>
        <p class="text-gray-600 text-lg font-medium">
          Loading recipe...
        </p>
      </div>
    `;

    const meal = await this.api.getMealById(mealId);

    if (!meal) {
      mealDetails.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-magnifying-glass text-gray-400 text-xl"></i>
          </div>
          <p class="text-gray-600 text-lg font-medium max-w-xs leading-relaxed">
            No recipe found.
          </p>
        </div>
      `;
      return;
    }

    const nutrition = await this.api.analyzeNutrition(
      meal.name,
      meal.ingredients,
    );

    mealDetails.innerHTML = this.showMealDetails(meal, nutrition);

    this.backMeal();
    this.addLogMealEvent(meal, nutrition);
  }

  backMeal() {
    const backbtn = document.getElementById("back-to-meals-btn");
    if (backbtn) {
      backbtn.addEventListener("click", () => {
        mealDetails.classList.add("hidden");
        mealsSection.classList.remove("hidden");
      });
    }
  }

  viewBtnGrid() {
    const viewBtn = document.querySelectorAll(".displayBtn");
    const gridBtn = document.getElementById("grid-view-btn") as HTMLElement;
    const listBtn = document.getElementById("list-view-btn") as HTMLElement;

    viewBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewBtn.forEach((b) => {
          b.classList.remove("active", "bg-white", "rounded-md", "shadow-sm");
        });

        btn.classList.add("active", "bg-white", "rounded-md", "shadow-sm");
      });
    });

    gridBtn.addEventListener("click", () => {
      recipesGrid.classList.remove(
        "sm:grid-cols-1",
        "md:grid-cols-3",
        "xl:grid-cols-2",
      );

      recipesGrid.classList.add(
        "grid",
        "sm:grid-cols-1",
        "md:grid-cols-3",
        "xl:grid-cols-4",
        "gap-5",
      );
    });

    listBtn.addEventListener("click", () => {
      recipesGrid.classList.remove(
        "md:grid-cols-4",
        "sm:grid-cols-1",
        "xl:grid-cols-3",
        "xl:grid-cols-4",
      );

      recipesGrid.classList.add("grid", "sm:grid-cols-2", "gap-5");
    });
  }

  addLogMealEvent(meal: Meal, nutrition: Nutrition | null) {
    const logMealBtn = document.getElementById("log-meal-btn");

    if (!logMealBtn) return;

    logMealBtn.addEventListener("click", () => {
      this.showLogMealModal(meal, nutrition);
    });
  }

  showLogMealModal(meal: Meal, nutrition: Nutrition | null) {
    const perServing: Partial<NutritionValues> = nutrition?.perServing || {};

    const oldModal = document.getElementById("log-meal-modal");

    oldModal?.remove();

    const modalHTML = `
    <div
      id="log-meal-modal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >

      <div
        class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative border border-gray-100"
      >

        <div class="flex items-center gap-4">

          <img
            src="${meal.thumbnail || "https://placehold.co/100x100?text=Food"}"
            alt="${meal.name || "Meal"}"
            class="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm"
            onerror="
              this.onerror=null;
              this.src='https://placehold.co/100x100?text=Food';
            "
          />

          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Log This Meal
            </h3>

            <p class="text-sm font-medium text-gray-400 mt-0.5">
              ${meal.name || "Unknown Meal"}
            </p>
          </div>

        </div>

        <div class="space-y-2">

          <label class="text-xs font-bold text-gray-700 block">
            Number of Servings
          </label>

          <div class="flex items-center gap-3">

            <button
              type="button"
              id="btn-decrement-servings"
              class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg"
            >
              -
            </button>

            <input
              type="number"
              id="servings-count-input"
              value="1"
              min="1"
              class="w-20 h-10 text-center font-bold text-gray-900 text-lg rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              id="btn-increment-servings"
              class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg"
            >
              +
            </button>

          </div>

        </div>

        <div
          class="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/60"
        >

          <span class="text-[11px] font-semibold text-gray-500 block mb-3">
            Estimated nutrition per serving:
          </span>

          <div class="grid grid-cols-4 gap-2 text-center">

            <div>
              <span
                id="modal-calories"
                class="text-base font-extrabold text-emerald-600 block"
              >
                ${perServing.calories || 0}
              </span>
              <span class="text-[10px] font-medium text-gray-400">
                Calories
              </span>
            </div>

            <div>
              <span
                id="modal-protein"
                class="text-base font-extrabold text-blue-600 block"
              >
                ${perServing.protein || 0}g
              </span>
              <span class="text-[10px] font-medium text-gray-400">
                Protein
              </span>
            </div>

            <div>
              <span
                id="modal-carbs"
                class="text-base font-extrabold text-amber-500 block"
              >
                ${perServing.carbs || 0}g
              </span>
              <span class="text-[10px] font-medium text-gray-400">
                Carbs
              </span>
            </div>

            <div>
              <span
                id="modal-fat"
                class="text-base font-extrabold text-purple-600 block"
              >
                ${perServing.fat || 0}g
              </span>
              <span class="text-[10px] font-medium text-gray-400">
                Fat
              </span>
            </div>

          </div>

        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">

          <button
            type="button"
            id="btn-cancel-modal"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-confirm-log-meal"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-bookmark text-xs"></i>
            <span>Log Meal</span>
          </button>

        </div>

      </div>
    </div>
  `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("log-meal-modal");

    const input = document.getElementById(
      "servings-count-input",
    ) as HTMLInputElement;

    const decrement = document.getElementById("btn-decrement-servings");

    const increment = document.getElementById("btn-increment-servings");

    const cancel = document.getElementById("btn-cancel-modal");

    const confirm = document.getElementById("btn-confirm-log-meal");

    decrement?.addEventListener("click", () => {
      const value = Number(input.value) || 1;

      if (value > 1) {
        input.value = String(value - 1);
      }
    });

    increment?.addEventListener("click", () => {
      const value = Number(input.value) || 1;

      input.value = String(value + 1);
    });

    cancel?.addEventListener("click", () => {
      modal?.remove();
    });

    confirm?.addEventListener("click", () => {
      const servings = Math.max(1, Number(input.value) || 1);

      foodLogManager.addMeal(meal, nutrition, servings);

      modal?.remove();
    });

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }
}

class ProductsAPI {
  async searchProducts(query: string): Promise<ProductsResponse | null> {
    try {
      const firstParams = new URLSearchParams({
        q: query,
        page: "1",
        limit: "24",
      });

      const firstResponse = await fetch(
        `https://nutriplan-api.vercel.app/api/products/search?${firstParams}`,
      );

      if (!firstResponse.ok) {
        throw new Error(`Failed to fetch products: ${firstResponse.status}`);
      }

      const firstData: ProductsResponse = await firstResponse.json();

      let allProducts = [...(firstData.results || [])];

      const totalPages =
        firstData.pagination?.totalPages ||
        firstData.pagination?.total_pages ||
        Math.ceil(
          (firstData.pagination?.total || 0) /
            (firstData.pagination?.limit || 24),
        );

      if (totalPages > 1) {
        const requests: Promise<ProductsResponse>[] = [];

        for (let page = 2; page <= totalPages; page++) {
          const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            limit: "24",
          });

          requests.push(
            fetch(
              `https://nutriplan-api.vercel.app/api/products/search?${params}`,
            ).then((response) => {
              if (!response.ok) {
                throw new Error(`Page ${page} failed`);
              }

              return response.json();
            }),
          );
        }

        const pages = await Promise.all(requests);

        pages.forEach((data) => {
          allProducts.push(...(data.results || []));
        });
      }

      return {
        results: allProducts,
      };
    } catch (error) {
      console.error("Products Search API Error:", error);
      return null;
    }
  }

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await fetch(
        `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const data: ProductResponse = await response.json();

      return data.result;
    } catch (error) {
      console.error("Product Barcode API Error:", error);
      return null;
    }
  }

  async getProductCategories() {
    try {
      const response = await fetch(
        "https://nutriplan-api.vercel.app/api/products/categories",
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch product categories: ${response.status}`,
        );
      }

      const data: unknown = await response.json();

      return data;
    } catch (error) {
      console.error("Product Categories API Error:", error);
      return null;
    }
  }

  async getProductsByCategory(
    category: string,
  ): Promise<ProductsResponse | null> {
    try {
      const response = await fetch(
        `https://nutriplan-api.vercel.app/api/products/category/${category}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products by category: ${response.status}`,
        );
      }

      const data: ProductsResponse = await response.json();

      return data;
    } catch (error) {
      console.error("Products Category API Error:", error);
      return null;
    }
  }
}

const productsAPI = new ProductsAPI();

class ProductRenderer {
  productsGrid: HTMLElement;
  productsCount: HTMLElement;

  constructor() {
    this.productsGrid = document.getElementById("products-grid") as HTMLElement;
    this.productsCount = document.getElementById(
      "products-count",
    ) as HTMLElement;
  }

  showProducts(data: Product[] | { results?: Product[] }) {
    const products = Array.isArray(data) ? data : data?.results || [];
    const cardsHTML = products
      .map((product: Product) => {
        const grade = product.nutritionGrade?.toLowerCase();

        const gradeColors: { [key: string]: string } = {
          a: "bg-green-500",
          b: "bg-lime-500",
          c: "bg-yellow-500",
          d: "bg-orange-500",
          e: "bg-red-500",
        };

        const gradeColor = gradeColors[grade || ""] || "bg-gray-500";

        return `
    <div 
      class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" 
      data-barcode="${product.barcode || ""}" 
    >

      <div 
        class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
      >

        <img 
          class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
          src="${product.image || ""}" 
          alt="${product.name || "Product"}" 
          loading="lazy" 
        />


        ${
          product.nutritionGrade
            ? `
              <div 
                class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase"
              >
                Nutri-Score ${product.nutritionGrade.toUpperCase()}
              </div>
            `
            : ""
        }


        ${
          product.novaGroup
            ? `
              <div 
                class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              >
                ${product.novaGroup}
              </div>
            `
            : ""
        }

      </div>


      <div class="p-4">


        <p 
          class="text-xs text-emerald-600 font-semibold mb-1 truncate"
        >
          ${product.brand || "Unknown Brand"}
        </p>


        <h3 
          class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
        >
          ${product.name || "Unknown Product"}
        </h3>

        <div 
          class="flex items-center gap-3 text-xs text-gray-500 mb-3"
        >
          <span>
            <i class="fa-solid fa-fire mr-1"></i>
            ${product.nutrients?.calories || 0} kcal/100g
          </span>
        </div>


        <div class="grid grid-cols-4 gap-1 text-center">

          <div class="bg-emerald-50 rounded p-1.5">
            <p class="text-xs font-bold text-emerald-700">
             ${Math.floor(product.nutrients?.protein || 0)}g
             
            </p>
            <p class="text-[10px] text-gray-500">
              Protein
            </p>
          </div>

         
          <div class="bg-blue-50 rounded p-1.5">
            <p class="text-xs font-bold text-blue-700">
              ${Math.floor(product.nutrients?.carbs || 0)}g
            </p>
            <p class="text-[10px] text-gray-500">
              Carbs
            </p>
          </div>

          <div class="bg-purple-50 rounded p-1.5">
            <p class="text-xs font-bold text-purple-700">
             ${Math.floor(product.nutrients?.fat || 0)}g
        
            </p>
            <p class="text-[10px] text-gray-500">
              Fat
            </p>
          </div>

       
          <div class="bg-orange-50 rounded p-1.5">
            <p class="text-xs font-bold text-orange-700">
             ${Math.floor(product.nutrients?.sugar || 0)}g
            
            </p>
            <p class="text-[10px] text-gray-500">
              Sugar
            </p>
          </div>

        </div>

      </div>

    </div>
  `;
      })
      .join("");

    this.productsGrid.innerHTML =
      cardsHTML ||
      `
        <div
          class="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center"
        >

          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-magnifying-glass text-gray-400 text-xl"
            ></i>
          </div>

          <p class="text-gray-600 text-lg font-medium">
            No products found.
          </p>

        </div>
      `;

    this.productsCount.textContent = `Showing ${products.length} products`;
  }

  showProductDetails(product: Product) {
    if (!product) return;

    const nutrition = product.nutrients || {};

    const grade = (product.nutritionGrade || "").toLowerCase();

    const gradeColors: { [key: string]: string } = {
      a: "bg-green-500",
      b: "bg-lime-500",
      c: "bg-yellow-500",
      d: "bg-orange-500",
      e: "bg-red-500",
    };

    const gradeNames: { [key: string]: string } = {
      a: "Excellent",
      b: "Good",
      c: "Average",
      d: "Poor",
      e: "Very Poor",
    };

    const gradeColor = gradeColors[grade] || "bg-gray-500";
    const gradeName = gradeNames[grade] || "Unknown";

    const novaScore = product.novaGroup || product.nova_group || null;

    const caloriesVal = nutrition.calories ?? 0;
    const proteinVal = nutrition.protein ?? 0;
    const carbsVal = nutrition.carbs ?? 0;
    const fatVal = nutrition.fat ?? 0;
    const sugarVal = nutrition.sugar ?? 0;
    const saturatedFatVal =
      nutrition.saturatedFat ?? nutrition.saturated_fat ?? 0;
    const fiberVal = nutrition.fiber ?? 0;

    const saltVal =
      nutrition.salt ??
      (nutrition.sodium ? (nutrition.sodium * 2.5).toFixed(2) : 0);

    const imageUrl =
      product.image || "https://placehold.co/100x100?text=No+Image";

    const modalHTML = `
    <div
      id="product-modal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >

      <div
        class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl space-y-5 text-left"
      >

        <button
          id="close-product-modal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>

        <div class="flex gap-4 items-start pr-8">

          <img
            src="${imageUrl}"
            alt="${product.name || "Product"}"
            class="w-24 h-24 object-contain rounded-lg border border-gray-100 shrink-0"
            onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=No+Image';"
          />

          <div class="space-y-1">

            <span
              class="text-xs font-semibold text-emerald-600 tracking-wide uppercase"
            >
              ${product.brand || "Unknown Brand"}
            </span>

            <h2 class="text-2xl font-bold text-gray-900 leading-tight">
              ${product.name || "Unknown Product"}
            </h2>

            <p class="text-xs text-gray-500">
              Barcode: ${product.barcode || "N/A"}
            </p>

        
            <div class="flex gap-2 pt-1">

              <div
                class="flex items-center bg-gray-50 border border-gray-200 rounded-md px-2 py-1 gap-1.5"
              >
                <span
                  class="${gradeColor} text-white font-bold text-xs px-1.5 py-0.5 rounded"
                >
                  ${grade && grade !== "unknown" ? grade.toUpperCase() : "?"}
                </span>

                <div class="text-[10px] leading-tight">
                  <span class="font-bold text-gray-700 block">
                    Nutri-Score
                  </span>

                  <span class="text-gray-500">
                    ${gradeName}
                  </span>
                </div>
              </div>


              ${
                novaScore
                  ? `
                    <div
                      class="flex items-center bg-orange-50 border border-orange-200 rounded-md px-2 py-1 gap-1.5"
                    >
                      <span
                        class="bg-orange-500 text-white font-bold text-xs px-1.5 py-0.5 rounded"
                      >
                        ${novaScore}
                      </span>

                      <div class="text-[10px] leading-tight">
                        <span class="font-bold text-orange-800 block">
                          NOVA
                        </span>

                        <span class="text-orange-600">
                          Processed
                        </span>
                      </div>
                    </div>
                  `
                  : ""
              }

            </div>
          </div>
        </div>

        <div
          class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-4"
        >

          <div
            class="flex items-center gap-2 text-xs font-semibold text-emerald-800"
          >
            <i class="fa-solid fa-apple-whole text-emerald-600"></i>

            <span>
              Nutrition Facts
              <span class="font-normal text-gray-500">
                (per 100g)
              </span>
            </span>
          </div>


          <div class="text-center">

            <span
              class="text-3xl font-extrabold text-gray-900 block leading-none"
            >
              ${Math.floor(caloriesVal)}
            </span>

            <span class="text-xs text-gray-500 font-medium">
              Calories
            </span>

          </div>


          <div class="grid grid-cols-4 gap-2 text-center pt-2">

            <div class="space-y-1">
              <div class="h-1.5 w-full bg-emerald-500 rounded-full"></div>

              <span class="text-xs font-bold text-gray-800 block">
                ${Math.floor(proteinVal)}g
              
              </span>

              <span class="text-[10px] text-gray-500">
                Protein
              </span>
            </div>

            <div class="space-y-1">
              <div class="h-1.5 w-full bg-sky-400 rounded-full"></div>

              <span class="text-xs font-bold text-gray-800 block">
                
                 ${Math.floor(carbsVal)}g
              </span>

              <span class="text-[10px] text-gray-500">
                Carbs
              </span>
            </div>

            <div class="space-y-1">
              <div class="h-1.5 w-full bg-purple-400 rounded-full"></div>

              <span class="text-xs font-bold text-gray-800 block">
           
                 ${Math.floor(fatVal)}g
              </span>

              <span class="text-[10px] text-gray-500">
                Fat
              </span>
            </div>

            <div class="space-y-1">
              <div class="h-1.5 w-full bg-orange-400 rounded-full"></div>

              <span class="text-xs font-bold text-gray-800 block">
             
                 ${Math.floor(sugarVal)}g
              </span>

              <span class="text-[10px] text-gray-500">
                Sugar
              </span>
            </div>

          </div>

          <div
            class="grid grid-cols-3 gap-2 text-center pt-2 border-t border-emerald-100/60"
          >

            <div>
              <span class="text-xs font-semibold text-gray-800 block">
             
                 ${Math.floor(saturatedFatVal)}g
              </span>

              <span class="text-[10px] text-gray-400">
                Saturated Fat
              </span>
            </div>

            <div>
              <span class="text-xs font-semibold text-gray-800 block">
              
                ${Math.floor(fiberVal)}g

              </span>

              <span class="text-[10px] text-gray-400">
                Fiber
              </span>
            </div>

            <div>
              <span class="text-xs font-semibold text-gray-800 block">
               
                ${Math.floor(Number(saltVal))}g
              </span>

              <span class="text-[10px] text-gray-400">
                Salt
              </span>
            </div>

          </div>

        </div>


        ${
          product.ingredients
            ? `
              <div class="bg-gray-50 rounded-xl p-4 space-y-2">

                <div
                  class="flex items-center gap-2 text-xs font-semibold text-gray-700"
                >
                  <i class="fa-solid fa-list text-gray-500"></i>

                  <span>Ingredients</span>
                </div>

                <p
                  class="text-[11px] text-gray-600 leading-relaxed"
                >
                  ${product.ingredients}
                </p>

              </div>
            `
            : ""
        }


        ${
          product.allergens
            ? `
              <div
                class="bg-red-50/60 border border-red-100 rounded-xl p-3 space-y-1"
              >

                <div
                  class="flex items-center gap-1.5 text-xs font-bold text-red-600"
                >
                  <i class="fa-solid fa-triangle-exclamation"></i>

                  <span>Allergens</span>
                </div>

                <p class="text-[11px] font-semibold text-red-500">
                  ${
                    Array.isArray(product.allergens)
                      ? product.allergens.join(", ")
                      : product.allergens
                  }
                </p>

              </div>
            `
            : ""
        }


        <div class="grid grid-cols-2 gap-3 pt-2">

          <button
            id="log-product-btn"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Log This Food</span>
          </button>

          <button
            id="close-product-modal-bottom"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  `;

    document.getElementById("product-modal")?.remove();
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("product-modal");
    const closeBtn = document.getElementById("close-product-modal");
    const closeBottomBtn = document.getElementById(
      "close-product-modal-bottom",
    );

    const closeModal = () => {
      modal?.remove();
    };

    closeBtn?.addEventListener("click", closeModal);
    closeBottomBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
    const logProductBtn = document.getElementById("log-product-btn");

    logProductBtn?.addEventListener("click", () => {
      foodLogManager.addProduct(product);

      closeModal();

      const toast = document.getElementById("toast-notification");
      const toastMessage = document.getElementById("toast-message");

      if (toast && toastMessage) {
        toastMessage.textContent = `${product.name} logged to your daily intake!`;

        toast.classList.remove("hidden", "opacity-0", "translate-y-4");

        setTimeout(() => {
          toast.classList.add("opacity-0", "translate-y-4");

          setTimeout(() => {
            toast.classList.add("hidden");
          }, 300);
        }, 3000);
      }
    });
  }
}

class ProductManager {
  api: ProductsAPI;
  renderer: ProductRenderer;
  searchInput: HTMLInputElement;
  searchBtn: HTMLElement;
  barcodeInput: HTMLInputElement;
  barcodeBtn: HTMLElement;
  nutriScoreFilters: NodeListOf<HTMLElement>;
  categoryButtons: NodeListOf<HTMLElement>;
  currentProducts: Product[];

  constructor(api: ProductsAPI, renderer: ProductRenderer) {
    this.api = api;
    this.renderer = renderer;

    this.searchInput = document.getElementById(
      "product-search-input",
    ) as HTMLInputElement;

    this.searchBtn = document.getElementById(
      "search-product-btn",
    ) as HTMLElement;

    this.barcodeInput = document.getElementById(
      "barcode-input",
    ) as HTMLInputElement;

    this.barcodeBtn = document.getElementById(
      "lookup-barcode-btn",
    ) as HTMLElement;

    this.nutriScoreFilters = document.querySelectorAll<HTMLElement>(
      ".nutri-score-filter",
    );

    this.categoryButtons = document.querySelectorAll<HTMLElement>(
      ".product-category-btn",
    );

    this.currentProducts = [];

    this.init();
  }

  init() {
    this.search();
    this.barcode();
    this.nutriScoreFilter();
    this.categoryFilter();
  }

  search() {
    this.searchBtn.addEventListener("click", async () => {
      const value = this.searchInput.value.trim();

      if (!value) {
        return;
      }

      await this.loadProducts("search", value);
    });

    this.searchInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        const value = this.searchInput.value.trim();

        if (!value) {
          return;
        }

        await this.loadProducts("search", value);
      }
    });
  }

  barcode() {
    this.barcodeBtn.addEventListener("click", async () => {
      const barcode = this.barcodeInput.value.trim();

      if (!barcode) {
        return;
      }

      await this.loadProducts("barcode", barcode);
    });
  }

  nutriScoreFilter() {
    this.nutriScoreFilters.forEach((button) => {
      button.addEventListener("click", () => {
        const grade = button.dataset.grade;

        this.nutriScoreFilters.forEach((btn) => {
          btn.classList.remove("active", "bg-emerald-600", "text-white");
        });

        button.classList.add("active", "bg-emerald-600", "text-white");

        if (!grade) {
          this.renderer.showProducts(this.currentProducts);

          return;
        }

        const filteredProducts = this.currentProducts.filter(
          (product) => product.nutritionGrade?.toLowerCase() === grade,
        );

        this.renderer.showProducts(filteredProducts);
      });
    });
  }

  categoryFilter() {
    this.categoryButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const category = button.textContent.trim().toLowerCase();

        await this.loadProducts("category", category);
      });
    });
  }

  async loadProducts(type: string, value: string = "") {
    this.renderer.productsGrid.innerHTML = `
      <div
        class="col-span-full flex flex-col items-center justify-center py-12"
      >

        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
        >
          <i
            class="fa-solid fa-spinner fa-spin text-emerald-600 text-xl"
          ></i>
        </div>

        <p class="text-gray-600 text-lg font-medium">
          Loading products...
        </p>

      </div>
    `;

    let data: ProductsResponse | null = null;

    if (type === "search") {
      data = await this.api.searchProducts(value);
    } else if (type === "category") {
      data = await this.api.getProductsByCategory(value);
    } else if (type === "barcode") {
      const product = await this.api.getProductByBarcode(value);

      data = product ? { results: [product] } : null;
    }

    if (!data) {
      this.currentProducts = [];

      this.renderer.showProducts([]);

      return;
    }

    this.currentProducts = Array.isArray(data) ? data : data.results || [];

    this.renderer.showProducts(this.currentProducts);

    this.addProductClickEvents();
  }

  addProductClickEvents() {
    const productCards =
      document.querySelectorAll<HTMLElement>(".product-card");

    productCards.forEach((card) => {
      card.addEventListener("click", async () => {
        const barcode = card.dataset.barcode;

        if (!barcode) {
          return;
        }

        const product = await this.api.getProductByBarcode(barcode);

        if (!product) {
          return;
        }

        console.log("Product Details:", product);

        this.renderer.showProductDetails(product);
      });
    });
  }
}

class ProductDetailsManager {
  api: ProductsAPI;

  constructor(api: ProductsAPI) {
    this.api = api;
  }

  showProductDetails(product: Product) {
    return `
      <div class="bg-white rounded-2xl shadow-lg p-6">

        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          ${product.product_name || "Unknown Product"}
        </h1>

        <img
          src="${product.image_url || ""}"
          alt="${product.product_name || "Product"}"
          class="w-full max-w-md mx-auto object-contain"
        >

        <div class="mt-6">

          <p class="text-gray-600">
            Brand:
            <span class="font-semibold">
              ${product.brands || "Unknown"}
            </span>
          </p>

          <p class="text-gray-600 mt-2">
            Nutri-Score:
            <span class="font-semibold">
              ${
                product.nutriscore_grade
                  ? product.nutriscore_grade.toUpperCase()
                  : "N/A"
              }
            </span>
          </p>

        </div>

      </div>
    `;
  }

  addProductClickEvents() {}

  async loadDetails(barcode: string) {
    const product = await this.api.getProductByBarcode(barcode);

    if (!product) {
      return;
    }

    return this.showProductDetails(product);
  }
}

class FoodLogManager {
  storageKey: string;
  items: LogItem[];
  toastTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.storageKey = "foodLog";
    this.items = JSON.parse(localStorage.getItem(this.storageKey) || "[]");

    this.init();
  }

  init() {
    this.updateDate();
    this.render();
    this.setupEvents();
  }

  updateDate() {
    const dateElement = document.getElementById("foodlog-date");

    if (!dateElement) return;

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  addProduct(product: Product) {
    if (!product) return;

    const nutrients = product.nutrients || {};

    const item = {
      id: Date.now().toString(),

      type: "product",

      name: product.name || "Unknown Product",

      image: product.image || "https://placehold.co/100x100?text=Food",

      calories: Number(nutrients.calories) || 0,
      protein: Number(nutrients.protein) || 0,
      carbs: Number(nutrients.carbs) || 0,
      fat: Number(nutrients.fat) || 0,

      servings: 1,

      createdAt: new Date().toISOString(),
    };

    this.items.push(item);

    this.save();
    this.render();

    this.showToast(`${item.name} logged to your daily intake!`);
  }

  addMeal(meal: Meal, nutrition: Nutrition | null, servings: number = 1) {
    if (!meal || !nutrition) return;

    const perServing: Partial<NutritionValues> = nutrition.perServing || {};

    const item = {
      id: Date.now().toString(),
      type: "meal",
      name: meal.name || "Unknown Meal",
      image: meal.thumbnail || "https://placehold.co/100x100?text=Food",
      calories: (Number(perServing.calories) || 0) * servings,
      protein: (Number(perServing.protein) || 0) * servings,
      carbs: (Number(perServing.carbs) || 0) * servings,
      fat: (Number(perServing.fat) || 0) * servings,
      servings,

      createdAt: new Date().toISOString(),
    };

    this.items.push(item);

    this.save();
    this.render();

    Swal.fire({
      icon: "success",
      title: "Meal Logged!",
      text: `${item.name} has been added to your food log.`,
      confirmButtonColor: "#10b981",
    });
  }

  addCustom({
    name,
    calories,
    protein,
    carbs,
    fat,
    servings,
  }: {
    name: string;
    calories: number | string;
    protein: number | string;
    carbs: number | string;
    fat: number | string;
    servings: number | string;
  }) {
    const item = {
      id: Date.now().toString(),

      type: "custom",

      name: name?.trim() || "Custom Food",

      image: "https://placehold.co/100x100?text=Food",

      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,

      servings: Number(servings) || 1,

      createdAt: new Date().toISOString(),
    };

    this.items.push(item);

    this.save();
    this.render();

    this.showToast(`${item.name} logged to your daily intake!`);
  }

  deleteItem(id: string | number) {
    this.items = this.items.filter((item) => item.id !== id);

    this.save();
    this.render();
  }

  clearAll() {
    if (!this.items.length) return;

    Swal.fire({
      icon: "warning",
      title: "Clear all food logs?",
      text: "All logged food for your current storage will be removed.",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.items = [];

      this.save();
      this.render();

      Swal.fire({
        icon: "success",
        title: "Cleared!",
        text: "Your food log has been cleared.",
        confirmButtonColor: "#10b981",
      });
    });
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  getTodayItems() {
    const today = new Date();

    return this.items.filter((item) => {
      const itemDate = new Date(item.createdAt);

      return (
        itemDate.getFullYear() === today.getFullYear() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getDate() === today.getDate()
      );
    });
  }

  getTodayTotals() {
    const todayItems = this.getTodayItems();

    return todayItems.reduce(
      (total, item: LogItem) => {
        total.calories += Number(item.calories) || 0;
        total.protein += Number(item.protein) || 0;
        total.carbs += Number(item.carbs) || 0;
        total.fat += Number(item.fat) || 0;

        return total;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    );
  }

  render() {
    this.renderProgress();
    this.renderLoggedItems();
    this.renderWeeklyOverview();
    this.renderWeeklyStats();
  }

  renderProgress() {
    const totals = this.getTodayTotals();

    const goals: { [key: string]: number } = {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 65,
    };

    const values: { [key: string]: number } = {
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
    };

    const cards = document.querySelectorAll(
      "#foodlog-today-section .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div",
    );

    if (!cards.length) return;

    const keys = ["calories", "protein", "carbs", "fat"];

    cards.forEach((card, index) => {
      const key = keys[index];

      if (!key) return;

      const value = values[key];
      const goal = goals[key];

      const percentage = Math.min((value / goal) * 100, 100);

      const percentageElement = card.querySelector(
        ".flex.items-center.justify-between.text-xs.mb-2 span:last-child",
      );

      const currentElement = card.querySelector(
        ".flex.justify-between.items-center.text-xs span:first-child",
      );

      const progressBar = card.querySelector<HTMLElement>(
        ".w-full.bg-gray-200\\/70 > div",
      );

      if (percentageElement) {
        percentageElement.textContent = `${Math.round(percentage)}%`;
      }

      if (currentElement) {
        currentElement.textContent =
          key === "calories"
            ? `${Math.round(value)} kcal`
            : `${value.toFixed(1)} g`;
      }

      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
    });
  }

  renderLoggedItems() {
    const container = document.getElementById("logged-items-list");

    if (!container) return;

    const todayItems = this.getTodayItems();

    const countElement = document.querySelector("#foodlog-today-section h4");

    if (countElement) {
      countElement.textContent = `Logged Items (${todayItems.length})`;
    }

    const clearButton = document.getElementById("clear-foodlog");

    if (clearButton) {
      clearButton.style.display = todayItems.length ? "flex" : "none";
    }

    if (!todayItems.length) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-center">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-utensils text-gray-300 text-4xl"></i>
          </div>

          <p class="font-semibold text-gray-500 mb-1">
            No food logged today
          </p>

          <p class="text-sm text-gray-400 mb-5">
            Start tracking your nutrition by logging meals or scanning products
          </p>

          <div class="flex items-center gap-3">
            <button
              id="empty-browse-recipes"
              class="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-all"
            >
              <i class="fa-solid fa-plus"></i>
              Browse Recipes
            </button>

            <button
              id="empty-scan-product"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all"
            >
              <i class="fa-solid fa-barcode"></i>
              Scan Product
            </button>
          </div>
        </div>
      `;

      document
        .getElementById("empty-browse-recipes")
        ?.addEventListener("click", () =>
          quickActionsManager.goToSection("meals-section"),
        );

      document
        .getElementById("empty-scan-product")
        ?.addEventListener("click", () =>
          quickActionsManager.goToSection("products-section"),
        );

      return;
    }

    container.innerHTML = todayItems
      .map((item) => {
        const time = new Date(item.createdAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        return `
          <div
            class="flex items-center justify-between p-3 bg-gray-50/60 rounded-xl hover:bg-gray-100/60 transition-all border border-gray-100"
          >

            <div class="flex items-center gap-3">

              <img
                src="${item.image}"
                alt="${item.name}"
                class="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-gray-200/60 shadow-sm"
                onerror="
                  this.onerror = null;
                  this.src = 'https://placehold.co/100x100?text=Food';
                "
              />

              <div>

                <h5 class="text-sm font-bold text-gray-900 leading-snug">
                  ${item.name}
                </h5>

                <p class="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">

                  <span>
                    ${item.servings} serving${(item.servings || 1) > 1 ? "s" : ""}
                  </span>

                  <span>•</span>

                  <span class="text-emerald-600 font-medium">
                     ${item.type === "meal" ? "Recipe" : item.type === "custom" ? "Custom" : "Product"}
                  </span>

                </p>

                <span class="text-[10px] text-gray-400 block mt-0.5">
                  ${time}
                </span>

              </div>
            </div>

            <div class="flex items-center gap-4">

              <div class="flex items-center gap-3 text-right">

                <div>
                  <span
                    class="text-sm font-extrabold text-emerald-600 block leading-tight"
                  >
                    ${Math.round(item.calories)}
                  </span>

                  <span
                    class="text-[9px] text-gray-400 font-medium block"
                  >
                    kcal
                  </span>
                </div>

                <div
                  class="flex items-center gap-1 text-[11px] font-semibold"
                >

                  <span
                    class="bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-md"
                  >
                    ${item.protein.toFixed(1)}g P
                  </span>

                  <span
                    class="bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded-md"
                  >
                    ${item.carbs.toFixed(1)}g C
                  </span>

                  <span
                    class="bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded-md"
                  >
                    ${item.fat.toFixed(1)}g F
                  </span>

                </div>
              </div>

              <button
                class="delete-foodlog-item text-gray-300 hover:text-red-500 transition-colors p-1"
                data-id="${item.id}"
                title="Delete item"
              >
                <i class="fa-regular fa-trash-can text-sm"></i>
              </button>

            </div>
          </div>
        `;
      })
      .join("");

    container
      .querySelectorAll<HTMLElement>(".delete-foodlog-item")
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.deleteItem(button.dataset.id as string);
        });
      });
  }

  renderWeeklyOverview() {
    const grid = document.getElementById("weekly-days-grid");

    if (!grid) return;

    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const items = this.items.filter((item) => {
        const itemDate = new Date(item.createdAt);

        return (
          itemDate.getFullYear() === date.getFullYear() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getDate() === date.getDate()
        );
      });

      const calories = items.reduce(
        (sum, item) => sum + (Number(item.calories) || 0),
        0,
      );

      days.push({
        date,
        items: items.length,
        calories,
      });
    }

    grid.innerHTML = days
      .map((day) => {
        const isToday = day.date.toDateString() === today.toDateString();

        return `
          <div
            class="p-3 rounded-xl ${
              isToday
                ? "bg-indigo-50/70 border border-indigo-100"
                : "bg-gray-50/50"
            } flex flex-col justify-center items-center"
          >

            <span
              class="text-sm font-medium ${
                isToday ? "text-indigo-500" : "text-gray-400"
              }"
            >
              ${day.date.toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>

            <span
              class="text-base font-bold ${
                isToday ? "text-indigo-900" : "text-gray-700"
              } mt-0.5"
            >
              ${day.date.getDate()}
            </span>

            ${
              day.calories
                ? `
                  <span class="text-lg font-extrabold text-emerald-600 mt-2">
                    ${Math.round(day.calories)}
                  </span>

                  <span class="text-xs text-emerald-600">
                    kcal
                  </span>

                  <span class="text-xs text-gray-400 mt-0.5">
                    ${day.items} item${day.items !== 1 ? "s" : ""}
                  </span>
                `
                : `
                  <span class="text-lg font-bold text-gray-300 mt-2">
                    0
                  </span>

                  <span class="text-xs text-gray-400">
                    kcal
                  </span>
                `
            }

          </div>
        `;
      })
      .join("");
  }

  renderWeeklyStats() {
    const today = new Date();

    const weekItems = this.items.filter((item) => {
      const date = new Date(item.createdAt);
      const diff = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return diff >= 0 && diff < 7;
    });

    const totalCalories = weekItems.reduce(
      (sum, item) => sum + Number(item.calories || 0),
      0,
    );

    const average = weekItems.length ? Math.round(totalCalories / 7) : 0;

    const averageElement = document.getElementById("weekly-average");
    const itemsElement = document.getElementById("weekly-items");

    if (averageElement) {
      averageElement.textContent = `${average} kcal`;
    }

    if (itemsElement) {
      itemsElement.textContent = `${weekItems.length} item${weekItems.length !== 1 ? "s" : ""}`;
    }
  }

  showToast(message: string) {
    let toast = document.getElementById("toast-notification");

    if (!toast) {
      toast = document.createElement("div");

      toast.id = "toast-notification";

      toast.className =
        "fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 font-semibold text-sm";

      toast.innerHTML = `
        <span id="toast-message" class="leading-tight"></span>
        <span class="text-base flex items-center justify-center">
          📝
        </span>
      `;

      document.body.appendChild(toast);
    }

    const messageElement = document.getElementById("toast-message");

    if (messageElement) {
      messageElement.textContent = message;
    }

    toast.classList.remove("opacity-0", "translate-y-4");
    toast.classList.add("opacity-100", "translate-y-0");

    if (this.toastTimer) clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-4");
    }, 3000);
  }

  setupEvents() {
    const clearButton = document.getElementById("clear-foodlog");

    clearButton?.addEventListener("click", () => {
      this.clearAll();
    });
  }
}

class QuickActionsManager {
  foodLogManager: FoodLogManager;
  buttons: NodeListOf<HTMLElement>;

  constructor(foodLogManager: FoodLogManager) {
    this.foodLogManager = foodLogManager;
    this.buttons = document.querySelectorAll<HTMLElement>(".quick-log-btn");

    this.init();
  }

  init() {
    if (this.buttons[0]) {
      this.buttons[0].addEventListener("click", () =>
        this.goToSection("meals-section"),
      );
    }

    if (this.buttons[1]) {
      this.buttons[1].addEventListener("click", () =>
        this.goToSection("products-section"),
      );
    }

    if (this.buttons[2]) {
      this.buttons[2].addEventListener("click", () =>
        this.openCustomEntryModal(),
      );
    }
  }

  goToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    const targetdata = section.dataset.section;

    const navLink = document.querySelector<HTMLElement>(
      `.nav-link[data-section="${targetdata}"]`,
    );

    if (navLink) {
      navLink.click();
    }

    setTimeout(() => {
      if (sectionId === "meals-section") {
        document.getElementById("search-input")?.focus();
      } else if (sectionId === "products-section") {
        document.getElementById("barcode-input")?.focus();
      }
    }, 100);
  }

  openCustomEntryModal() {
    document.getElementById("custom-entry-modal")?.remove();

    const modalHTML = `
      <div
        id="custom-entry-modal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative border border-gray-100">

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <i class="fa-solid fa-pencil text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Custom Entry</h3>
              <p class="text-sm font-medium text-gray-400 mt-0.5">Add your own food</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Food Name</label>
              <input
                type="text"
                id="custom-food-name"
                placeholder="e.g. Homemade Sandwich"
                class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Calories</label>
                <input type="number" id="custom-food-calories" min="0" value="0"
                  class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Servings</label>
                <input type="number" id="custom-food-servings" min="1" value="1"
                  class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Protein (g)</label>
                <input type="number" id="custom-food-protein" min="0" value="0"
                  class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Carbs (g)</label>
                <input type="number" id="custom-food-carbs" min="0" value="0"
                  class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Fat (g)</label>
                <input type="number" id="custom-food-fat" min="0" value="0"
                  class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-sm" />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              id="btn-cancel-custom-entry"
              class="w-full py-3 px-4 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-confirm-custom-entry"
              class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              <span>Add Food</span>
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("custom-entry-modal");
    const cancelBtn = document.getElementById("btn-cancel-custom-entry");
    const confirmBtn = document.getElementById("btn-confirm-custom-entry");

    cancelBtn?.addEventListener("click", () => modal?.remove());

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });

    confirmBtn?.addEventListener("click", () => {
      const nameInput = document.getElementById(
        "custom-food-name",
      ) as HTMLInputElement;
      const name = nameInput.value.trim();

      if (!name) {
        nameInput.focus();
        nameInput.classList.add("border-red-400");
        return;
      }

      const calories = (
        document.getElementById("custom-food-calories") as HTMLInputElement
      ).value;
      const protein = (
        document.getElementById("custom-food-protein") as HTMLInputElement
      ).value;
      const carbs = (
        document.getElementById("custom-food-carbs") as HTMLInputElement
      ).value;
      const fat = (
        document.getElementById("custom-food-fat") as HTMLInputElement
      ).value;
      const servings = (
        document.getElementById("custom-food-servings") as HTMLInputElement
      ).value;

      this.foodLogManager.addCustom({
        name,
        calories,
        protein,
        carbs,
        fat,
        servings,
      });

      modal?.remove();
    });
  }
}

const foodLogManager = new FoodLogManager();
const quickActionsManager = new QuickActionsManager(foodLogManager);
const productRenderer = new ProductRenderer();
const productManager = new ProductManager(productsAPI, productRenderer);
const productDetailsManager = new ProductDetailsManager(productsAPI);
const recipeRenderer = new RecipeRenderer();
const recipeManager = new RecipeManager(recipeRenderer, mealsAPI);
const recipeDetailsManager = new RecipeDetailsManager(mealsAPI);
const appLoader = new AppLoader();
appLoader.init();
recipeManager.areaFilter();

recipeManager.categoryFilter();
recipeManager.search();
recipeDetailsManager.viewBtnGrid();
await recipeManager.loadMeals("random");

const navigation = new Navigation();
navigation.init();
const sidebar = new Sidebar();
sidebar.init();

export {};
