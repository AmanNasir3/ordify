import styles from "./Header.module.css";
import useSession from "../helper/useSession";
import { useState, useEffect } from "react";
import {
  Image,
  Flex,
  Text,
  Box,
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogBackdrop,
  DialogCloseTrigger,
  Table,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import { FiCalendar, FiShoppingBag, FiPackage } from "react-icons/fi";
import { getGuestOrders } from "../services/api/Instance";

interface HeaderProps {
  verificationComplete?: boolean;
}

interface Order {
  id: number;
  sub_booking_id: number;
  item_id: number;
  name: string;
  description: string | null;
  room_no: number;
  price: string | null;
  type_id: number;
  is_custom_amount: boolean;
  custom_amount: string | null;
  quantity: number;
  total_amount: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  approved: "blue",
  completed: "green",
  resolved: "teal",
  rejected: "red",
  cancelled: "orange",
  "not-completed": "gray",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Header = ({ verificationComplete }: HeaderProps) => {
  const [session, setSession] = useState(() => useSession("session", null));
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isServiceDetailPage = location.pathname.startsWith("/service/");
console.log({orders});

  useEffect(() => {
    if (verificationComplete) {
      const updatedSession = useSession("session", null);
      setSession(updatedSession);
    }
  }, [verificationComplete]);

  const handleMyOrders = async () => {
    setOrdersOpen(true);
    setOrdersLoading(true);
    try {
      const subBookingId = session?.user_details?.sub_booking_id;
      const res = await getGuestOrders(subBookingId);
      console.log('res?.data',res?.data);
      
      setOrders(Array.isArray(res?.data?.data) ? res.data?.data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Flex alignItems="center" gap={3}>
            {isServiceDetailPage && (
              <Box
                as="button"
                onClick={() => navigate("/")}
                color="white"
                fontSize="24px"
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                display="flex"
                alignItems="center"
                aria-label="Go back"
              >
                <IoArrowBack />
              </Box>
            )}
            {session?.logoURL ? (
              <Image
                src={session.logoURL}
                alt="Hotel Logo"
                boxSize="70px"
                objectFit="contain"
              />
            ) : (
              <div />
            )}
            {session?.hotel_name && (
              <Text
                color="white"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                fontWeight="600"
                lineHeight="1.2"
              >
                {session.hotel_name}
              </Text>
            )}
            <Flex
              as="button"
              onClick={handleMyOrders}
              align="center"
              gap={1.5}
              px={3}
              py={1.5}
              borderRadius="full"
              bg="whiteAlpha.200"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="white"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="500"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{
                bg: "whiteAlpha.300",
                borderColor: "whiteAlpha.500",
                transform: "translateY(-1px)",
              }}
              _active={{ transform: "translateY(0)" }}
            >
              <FiShoppingBag size={14} />
              My Orders
            </Flex>
          </Flex>
          <div className={styles.actions}>
            <Box>
              <Text
                color="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="wide"
              >
                Welcome back 👋
              </Text>
              <Text
                color="white"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                fontWeight="bold"
                lineHeight="short"
              >
                {session?.user_details?.guest_name || "Guest"}
              </Text>
            </Box>
          </div>
        </div>
      </header>

      <DialogRoot
        open={ordersOpen}
        onOpenChange={(e) => setOrdersOpen(e.open)}
        size="xl"
        placement="center"
        scrollBehavior="inside"
        motionPreset="slide-in-bottom"
        
      >
        <DialogBackdrop backdropFilter="blur(4px)" bg="blackAlpha.700" />
        <DialogContent
          borderRadius="2xl"
          mx={{ base: 3, md: "auto" }}
          my="auto"
          maxW={{ base: "95vw", md: "80vw", lg: "70vw" }}
          boxShadow="0 25px 60px rgba(0,0,0,0.2)"
        >
          <DialogCloseTrigger top={3} right={3} />
          <DialogBody p={0}>
            {ordersLoading ? (
              <Flex justify="center" align="center" py={20}>
                <Spinner size="xl" color="purple.500" borderWidth="3px" />
              </Flex>
            ) : (
              <Box
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid"
                borderColor="gray.100"
                bg="white"
              >
                {/* Gradient header band */}
                <Box
                  background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  px={6}
                  py={5}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        w={10}
                        h={10}
                        borderRadius="xl"
                        bg="whiteAlpha.200"
                      >
                        <FiPackage size={20} color="white" />
                      </Flex>
                      <Box>
                        <Text fontSize="lg" fontWeight="700" color="white" lineHeight="1.2">
                          My Orders
                        </Text>
                        <Text fontSize="xs" color="whiteAlpha.800" fontWeight="400">
                          Room {orders[0]?.room_no ?? "—"}
                        </Text>
                      </Box>
                    </Flex>
                    {orders.length > 0 && (
                      <Badge
                        px={3}
                        py={1.5}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="700"
                        bg="whiteAlpha.300"
                        color="white"
                        border="1px solid"
                        borderColor="whiteAlpha.400"
                      >
                        {orders.length} {orders.length === 1 ? "order" : "orders"}
                      </Badge>
                    )}
                  </Flex>
                </Box>

                {orders.length === 0 ? (
                  <Box py={16} textAlign="center" px={6}>
                    <Flex justify="center" mb={4}>
                      <Box
                        w={16}
                        h={16}
                        borderRadius="2xl"
                        background="linear-gradient(135deg, #667eea22 0%, #764ba222 100%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FiShoppingBag size={32} color="#667eea" />
                      </Box>
                    </Flex>
                    <Text fontSize="lg" fontWeight="700" color="gray.700" mb={1}>
                      No orders yet
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Your order history will appear here
                    </Text>
                  </Box>
                ) : (
                  <Box
                    maxH="60vh"
                    overflowY="auto"
                    overflowX="auto"
                    position="relative"
                    zIndex={0}
                    css={{
                      "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                      "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
                      "&::-webkit-scrollbar-thumb": { backgroundColor: "#E2E8F0", borderRadius: "4px" },
                      "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#A0AEC0" },
                    }}
                  >
                    <Table.Root size="sm">
                      <Table.Header position="sticky" top={0} zIndex={1}>
                        <Table.Row>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                            w="50px"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              #
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                          >
                            <Flex align="center" gap={2}>
                              <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                                Type
                              </Text>
                            </Flex>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              Item
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              Room
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                            textAlign="center"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              Qty
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                            textAlign="right"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              Amount
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                              Status
                            </Text>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            bg="gray.50"
                            py={4}
                            px={4}
                            borderBottom="2px solid"
                            borderColor="gray.200"
                          >
                            <Flex align="center" gap={2}>
                              <FiCalendar size={13} color="#718096" />
                              <Text fontSize="xs" fontWeight="700" color="gray.700" textTransform="uppercase" letterSpacing="wider">
                                Date
                              </Text>
                            </Flex>
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {orders.map((order, index) => (
                          <Table.Row
                            key={order.id}
                            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                            cursor="default"
                            _hover={{
                              bg: "blue.50",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <Table.Cell px={4} py={3}>
                              <Text fontSize="sm" fontWeight="600" color="gray.400">
                                {index + 1}
                              </Text>
                            </Table.Cell>
                            <Table.Cell px={4} py={3}>
                              <Badge
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontSize="xs"
                                fontWeight="600"
                                colorPalette={order.type_id === 1 ? "purple" : "cyan"}
                                variant="subtle"
                              >
                                {order.type_id === 1 ? "POS Item" : "Other Item"}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell px={4} py={3}>
                              <Text fontWeight="700" fontSize="sm" color="gray.700">
                                {order.name}
                              </Text>
                            </Table.Cell>
                            <Table.Cell px={4} py={3}>
                              <Text fontSize="sm" color="gray.500" fontWeight="500">
                                {order.room_no}
                              </Text>
                            </Table.Cell>
                            <Table.Cell px={4} py={3} textAlign="center">
                              <Text fontSize="sm" color="gray.500" fontWeight="500">
                                {order.quantity > 0 ? order.quantity : "-"}
                              </Text>
                            </Table.Cell>
                            <Table.Cell px={4} py={3} textAlign="right">
                              <Text fontSize="sm" fontWeight="600" color={parseFloat(order.total_amount) > 0 ? "gray.700" : "gray.400"} fontStyle={parseFloat(order.total_amount) > 0 ? "normal" : "italic"}>
                                {parseFloat(order.total_amount) > 0
                                  ? `₹${parseFloat(order.total_amount).toLocaleString()}`
                                  : "—"}
                              </Text>
                            </Table.Cell>
                            <Table.Cell px={4} py={3}>
                              <Badge
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontSize="xs"
                                fontWeight="600"
                                colorPalette={STATUS_COLORS[order.status] ?? "gray"}
                                variant="subtle"
                                textTransform="capitalize"
                              >
                                {order.status}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell px={4} py={3}>
                              <Flex align="center" gap={2}>
                                <FiCalendar size={13} color="#A0AEC0" />
                                <Text fontSize="sm" color="gray.500" fontWeight="500" whiteSpace="nowrap">
                                  {formatDate(order.created_at)}
                                </Text>
                              </Flex>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                )}
              </Box>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default Header;
