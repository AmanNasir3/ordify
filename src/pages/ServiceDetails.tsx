import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Service } from "../types";
import styles from "./ServiceDetails.module.css";
import layoutStyles from "./ServiceDetailsLayout.module.css";
import formStyles from "./ServiceDetailsForm.module.css";
import {
  Box,
  Button,
  Text,
  Image,
  Flex,
  IconButton,
  HStack,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react";
import { RadioGroup } from "@chakra-ui/react";
import { Accordion } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { getSubcategoriesByCategory } from "../services/api/Instance";
import DefaultImage from "../assets/images.png";

// HousekeepingDetails component
const HousekeepingDetails = ({
  subCategory,
  category,
}: {
  subCategory: any;
  category: any;
}) => {
  interface ServiceOption {
    name: string;
    description: string;
  }

  interface ServiceCategory {
    id: string;
    name: string;
    options: ServiceOption[];
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Map API subcategories to departments
  const departments: ServiceCategory[] =
    subCategory?.map((sub: any) => ({
      id: sub.id.toString(),
      name: sub.name,
      options: sub.items.map((item: any) => ({
        name: item.name,
        description: item.description || "",
      })),
    })) || [];

  // Set first section as active on mount
  useEffect(() => {
    if (departments.length > 0 && !activeSection) {
      setActiveSection(departments[0].id);
    }
  }, [departments]);

  // Scroll spy - detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = departments.map((dept) =>
        document.getElementById(dept.id),
      );

      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if section is in viewport (with some offset for better UX)
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    const optionsPanel = document.querySelector(
      `.${layoutStyles.optionsPanel}`,
    );
    if (optionsPanel) {
      optionsPanel.addEventListener("scroll", handleScroll);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (optionsPanel) {
        optionsPanel.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [departments]);

  const handleScrollToSection = (categoryId: string) => {
    setActiveSection(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const handleRemoveSelected = (option: string) => {
    setSelectedOptions((prev) => prev.filter((o) => o !== option));
  };

  if (!subCategory || departments.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }
  console.log({ category });

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={category?.image ?? DefaultImage}
          alt={category?.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{category?.name}</h1>
      </div>
      <div className={layoutStyles.detailsLayout}>
        {/* Left: Departments */}
        <aside className={layoutStyles.departmentsSidebar}>
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={
                layoutStyles.departmentBtn +
                (activeSection === dept.id ? " " + layoutStyles.selected : "")
              }
              onClick={() => handleScrollToSection(dept.id)}
            >
              {dept.name}
            </button>
          ))}
        </aside>
        {/* Middle: Categories with Accordions */}
        <section className={layoutStyles.optionsPanel}>
          <Accordion.Root
            multiple
            defaultValue={departments.map((d) => d.id)}
            collapsible
          >
            {departments.map((category) => (
              <div
                key={category.id}
                id={category.id}
                style={{
                  marginBottom: "1rem",
                  scrollMarginTop: "100px",
                }}
              >
                <Accordion.Item value={category.id}>
                  <Box
                    bg="white"
                    borderRadius="12px"
                    boxShadow={activeSection === category.id ? "md" : "sm"}
                    overflow="hidden"
                    borderWidth="2px"
                    transition="all 0.3s"
                  >
                    <Accordion.ItemTrigger
                      style={{
                        width: "100%",
                        padding: "1rem",
                        backgroundColor: "#f7fafc",
                        borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text fontSize="lg" fontWeight="700" color="gray.800">
                        {category.name}
                      </Text>
                      <Accordion.ItemIndicator>▼</Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <VStack gap={0} align="stretch">
                        {category.options.map((option, idx) => {
                          const isSelected = selectedOptions.includes(
                            option.name,
                          );
                          return (
                            <Box
                              key={option.name}
                              borderBottom={
                                idx < category.options.length - 1
                                  ? "1px solid"
                                  : "none"
                              }
                              borderColor="gray.100"
                              bg={isSelected ? "blue.50" : "white"}
                              transition="background-color 0.2s"
                            >
                              <Box p={4}>
                                <Flex align="flex-start" gap={3}>
                                  <input
                                    type="checkbox"
                                    className={layoutStyles.checkbox}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleOptionToggle(option.name)
                                    }
                                    id={`opt-${option.name}`}
                                    style={{ marginTop: "4px", flexShrink: 0 }}
                                  />
                                  <Box flex="1">
                                    <label
                                      htmlFor={`opt-${option.name}`}
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        color: isSelected
                                          ? "#2b6cb0"
                                          : "#1a202c",
                                        cursor: "pointer",
                                        display: "block",
                                        marginBottom: "0.25rem",
                                      }}
                                    >
                                      {option.name}
                                    </label>
                                    <Text
                                      fontSize="sm"
                                      color={
                                        isSelected ? "blue.700" : "gray.600"
                                      }
                                      lineHeight="1.5"
                                    >
                                      {option.description}
                                    </Text>
                                  </Box>
                                </Flex>
                              </Box>
                            </Box>
                          );
                        })}
                      </VStack>
                    </Accordion.ItemContent>
                  </Box>
                </Accordion.Item>
              </div>
            ))}
          </Accordion.Root>
        </section>
        {/* Right: Selected options and form */}
        <aside className={layoutStyles.rightPanel}>
          {selectedOptions.length > 0 && (
            <div className={layoutStyles.selectedOptionsBar}>
              {selectedOptions.map((opt) => (
                <span key={opt} className={layoutStyles.selectedOption}>
                  {opt}
                  <button
                    className={layoutStyles.removeBtn}
                    onClick={() => handleRemoveSelected(opt)}
                    aria-label={`Remove ${opt}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form className={formStyles.formCard}>
            <div className={formStyles.formTitle}>Your Request</div>
            <div className={formStyles.formGroup}>
              <label htmlFor="reservationName" className={formStyles.label}>
                Your Reservation Name
              </label>
              <input
                type="text"
                id="reservationName"
                name="reservationName"
                className={formStyles.input}
                required
              />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="email" className={formStyles.label}>
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={formStyles.input}
                required
              />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="comments" className={formStyles.label}>
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className={formStyles.input + " " + formStyles.textarea}
              />
            </div>
            <button type="submit" className={formStyles.submitBtn}>
              Submit Request
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};

// RoomServiceDetails component
const RoomServiceDetails = ({ service }: { service: Service }) => {
  interface MenuItem {
    id: string;
    name: string;
    regularPrice: number;
    largePrice: number;
    image?: string;
  }

  interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
  }

  interface CartItem {
    id: string;
    name: string;
    size: "Regular" | "Large";
    price: number;
    quantity: number;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<"Regular" | "Large">(
    "Regular",
  );
  const [cart, setCart] = useState<CartItem[]>([]);

  const menuData: MenuCategory[] = [
    {
      id: "soups",
      name: "THE SOUP OPERA",
      items: [
        {
          id: "s1",
          name: "Chicken Corn Soup",
          regularPrice: 385,
          largePrice: 570,
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
        },
        {
          id: "s2",
          name: "Cream of Mushroom Soup",
          regularPrice: 570,
          largePrice: 740,
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop",
        },
        {
          id: "s3",
          name: "Cream of Chicken Soup",
          regularPrice: 640,
          largePrice: 820,
          image:
            "https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "salads",
      name: "THE GREEN BAR",
      items: [
        {
          id: "sl1",
          name: "Russian Salad",
          regularPrice: 605,
          largePrice: 805,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
        },
        {
          id: "sl2",
          name: "Fresh Green Salad",
          regularPrice: 280,
          largePrice: 450,
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "fastfood",
      name: "VERY FAST FOOD",
      items: [
        {
          id: "ff1",
          name: "Chicken Nuggets with Fries",
          regularPrice: 1020,
          largePrice: 1320,
          image:
            "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop",
        },
        {
          id: "ff2",
          name: "Chicken Burger",
          regularPrice: 770,
          largePrice: 970,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
        },
        {
          id: "ff3",
          name: "Beef Burger",
          regularPrice: 785,
          largePrice: 985,
          image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
        },
        {
          id: "ff4",
          name: "Club Sandwich",
          regularPrice: 690,
          largePrice: 890,
          image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "chinese",
      name: "FROM CHINA WITH LOVE",
      items: [
        {
          id: "ch1",
          name: "Chicken Manchurian",
          regularPrice: 1090,
          largePrice: 1390,
          image:
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
        },
        {
          id: "ch2",
          name: "Chicken Chow Mein",
          regularPrice: 1040,
          largePrice: 1340,
          image:
            "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop",
        },
        {
          id: "ch3",
          name: "Chicken Fried Rice",
          regularPrice: 910,
          largePrice: 1210,
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "desserts",
      name: "DESSERT LOUNGE",
      items: [
        {
          id: "d1",
          name: "Cream Caramel",
          regularPrice: 280,
          largePrice: 380,
          image:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop",
        },
        {
          id: "d2",
          name: "Choice of Ice Cream",
          regularPrice: 175,
          largePrice: 275,
          image:
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop",
        },
        {
          id: "d3",
          name: "Chocolate Mousse",
          regularPrice: 305,
          largePrice: 405,
          image:
            "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "beverages",
      name: "HOT & COLD BEVERAGES",
      items: [
        {
          id: "b1",
          name: "Cold Coffee",
          regularPrice: 370,
          largePrice: 520,
          image:
            "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=400&fit=crop",
        },
        {
          id: "b2",
          name: "Fresh Juices",
          regularPrice: 400,
          largePrice: 550,
          image:
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop",
        },
        {
          id: "b3",
          name: "Milkshake",
          regularPrice: 450,
          largePrice: 600,
          image:
            "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
        },
        {
          id: "b4",
          name: "Green Tea",
          regularPrice: 195,
          largePrice: 295,
          image:
            "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=400&fit=crop",
        },
      ],
    },
  ];

  const handleChooseOptions = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedSize("Regular");
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const price =
      selectedSize === "Regular"
        ? selectedItem.regularPrice
        : selectedItem.largePrice;
    const cartItemId = `${selectedItem.id}-${selectedSize}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          name: selectedItem.name,
          size: selectedSize,
          price,
          quantity: 1,
        },
      ];
    });

    setIsModalOpen(false);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Box>
      <div className={styles.headerSection}>
        <img
          src={service.image}
          alt={service.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{service.name}</h1>
      </div>

      <Flex
        gap={6}
        p={6}
        maxW="1400px"
        mx="auto"
        flexDirection={{ base: "column", lg: "row" }}
      >
        {/* Left Side - Menu */}
        <Box flex="1" minW="0">
          <Tabs.Root variant="plain" defaultValue={menuData[0].id}>
            <Tabs.List flexWrap="wrap" gap={2} mb={6}>
              {menuData.map((category) => (
                <Tabs.Trigger
                  key={category.id}
                  value={category.id}
                  fontSize="sm"
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="full"
                  _selected={{ bg: "blue.500", color: "white" }}
                >
                  {category.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.ContentGroup>
              {menuData.map((category) => (
                <Tabs.Content key={category.id} value={category.id} p={0}>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                    gap={4}
                  >
                    {category.items.map((item) => (
                      <Box
                        key={item.id}
                        borderRadius="12px"
                        overflow="hidden"
                        boxShadow="md"
                        bg="white"
                        transition="all 0.3s"
                        cursor="pointer"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "lg",
                        }}
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            w="100%"
                            h="180px"
                            objectFit="cover"
                          />
                        )}
                        <Box p={4}>
                          <Text fontSize="lg" fontWeight="600" mb={3}>
                            {item.name}
                          </Text>
                          <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                              Starting from{" "}
                              <Text as="span" fontWeight="700" color="gray.800">
                                PKR {item.regularPrice}
                              </Text>
                            </Text>
                            <Button
                              size="sm"
                              color={"black"}
                              onClick={() => handleChooseOptions(item)}
                            >
                              Choose options →
                            </Button>
                          </Flex>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.ContentGroup>
          </Tabs.Root>
        </Box>

        {/* Right Side - Your Order */}
        <Box
          w={{ base: "100%", lg: "350px" }}
          bg="white"
          borderRadius="12px"
          boxShadow="md"
          p={6}
          position={{ base: "relative", lg: "sticky" }}
          top={{ lg: "20px" }}
          h="fit-content"
        >
          <Text fontSize="xl" fontWeight="700" mb={4}>
            Your Order
          </Text>
          <Separator mb={4} />

          {cart.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={8}>
              You haven't added anything to your order yet.
            </Text>
          ) : (
            <VStack gap={3} align="stretch" mb={4}>
              {cart.map((item) => (
                <Box
                  key={item.id}
                  p={3}
                  bg="gray.50"
                  borderRadius="8px"
                  position="relative"
                >
                  <IconButton
                    aria-label="Remove item"
                    size="xs"
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <IoClose />
                  </IconButton>
                  <Text fontSize="sm" fontWeight="600" mb={1}>
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    Size: {item.size} | Qty: {item.quantity}
                  </Text>
                  <Text fontSize="sm" fontWeight="700">
                    PKR {item.price * item.quantity}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}

          <Separator mb={4} />

          <Flex justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="700">
              TOTAL
            </Text>
            <Text fontSize="lg" fontWeight="700" color="blue.600">
              PKR {calculateTotal().toLocaleString()}
            </Text>
          </Flex>

          <Button
            w="100%"
            colorScheme="blue"
            size="lg"
            disabled={cart.length === 0}
          >
            Continue
          </Button>
        </Box>
      </Flex>

      {/* Size Selection Modal */}
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => setIsModalOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{selectedItem?.name}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" fontWeight="600" mb={3}>
                Select size:
              </Text>
              <RadioGroup.Root
                value={selectedSize}
                onValueChange={(e) =>
                  setSelectedSize(e.value as "Regular" | "Large")
                }
              >
                <VStack gap={3} align="stretch">
                  <Box
                    p={4}
                    border="2px"
                    borderColor={
                      selectedSize === "Regular" ? "blue.500" : "gray.200"
                    }
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => setSelectedSize("Regular")}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <RadioGroup.Item value="Regular" colorPalette="blue" />
                        <Text fontWeight="600">Regular</Text>
                      </HStack>
                      <Text fontWeight="700">
                        PKR {selectedItem?.regularPrice}
                      </Text>
                    </HStack>
                  </Box>

                  <Box
                    p={4}
                    border="2px"
                    borderColor={
                      selectedSize === "Large" ? "blue.500" : "gray.200"
                    }
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => setSelectedSize("Large")}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <RadioGroup.Item value="Large" colorPalette="blue" />
                        <Text fontWeight="600">Large</Text>
                      </HStack>
                      <Text fontWeight="700">
                        PKR {selectedItem?.largePrice}
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </RadioGroup.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAddToCart}>
                Add to Order
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

// NearbyAttractionsDetails component
const NearbyAttractionsDetails = ({ service }: { service: Service }) => {
  interface Attraction {
    id: string;
    name: string;
    description: string;
    image: string;
  }

  // Featured attraction (large card at the top)
  const featuredAttraction: Attraction = {
    id: "featured",
    name: "Discover Local Attractions",
    description:
      "Explore the best places around our hotel. From historical landmarks to beautiful parks, dining experiences to shopping destinations, discover everything our neighborhood has to offer.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop",
  };

  // Regular attractions
  const attractionsData: Attraction[] = [
    {
      id: "1",
      name: "Historic City Center",
      description:
        "Explore the heart of the city with its rich history and beautiful architecture.",
      image:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
    },
    {
      id: "2",
      name: "Waterfront Promenade",
      description:
        "A scenic walkway along the water featuring cafes and restaurants.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    },
    {
      id: "3",
      name: "National Museum",
      description:
        "Discover the country's rich cultural heritage and art collections.",
      image:
        "https://images.unsplash.com/photo-1565909920184-0d7e6b0c7c1b?w=600&h=400&fit=crop",
    },
    {
      id: "4",
      name: "Botanical Gardens",
      description:
        "A peaceful oasis featuring diverse plant collections and walking paths.",
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop",
    },
    {
      id: "5",
      name: "Shopping Mall",
      description:
        "Modern shopping complex with international brands and dining options.",
      image:
        "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&h=400&fit=crop",
    },
    {
      id: "6",
      name: "Local Artisan Market",
      description:
        "Authentic local crafts, handmade goods, and traditional products.",
      image:
        "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop",
    },
    {
      id: "7",
      name: "Fine Dining Restaurant",
      description:
        "Award-winning restaurant offering exquisite cuisine and elegant ambiance.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    },
    {
      id: "8",
      name: "Beach & Waterfront",
      description:
        "Sandy beaches with crystal clear water and beachfront cafes.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={service.image}
          alt={service.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{service.name}</h1>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Featured Card */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "2.5rem",
            background: "white",
          }}
        >
          <img
            src={featuredAttraction.image}
            alt={featuredAttraction.name}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
            }}
          />
          <div style={{ padding: "2rem" }}>
            <h2
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              {featuredAttraction.name}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              {featuredAttraction.description}
            </p>
          </div>
        </div>

        {/* Regular Attractions Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {attractionsData.map((attraction) => (
            <div
              key={attraction.id}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "white",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={attraction.image}
                alt={attraction.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {attraction.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                  }}
                >
                  {attraction.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceDetails = () => {
  const { slug } = useParams();
  const { state } = useLocation();
  const category = state?.category || null;
  const [subCategory, setSubCategory] = useState<any>(null);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await getSubcategoriesByCategory(category?.id);
        if (response.status === 200 && response.data.data) {
          setSubCategory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategory();
  }, []);

  // Conditional rendering for housekeeping
  if (slug === "house-keeping") {
    return (
      <HousekeepingDetails subCategory={subCategory} category={category} />
    );
  }

  // Conditional rendering for room service
  if (slug === "room-service") {
    return <RoomServiceDetails service={subCategory} />;
  }

  // Conditional rendering for nearby attractions
  if (slug === "nearby-attractions") {
    return <NearbyAttractionsDetails service={subCategory} />;
  }

  // Placeholder for other services
  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={category?.image}
          alt={category?.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{category?.name}</h1>
        <p className={styles.description}>More information coming soon</p>
      </div>
      <div className={layoutStyles.detailsLayout}>
        <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
          <h2>Service details coming soon!</h2>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
