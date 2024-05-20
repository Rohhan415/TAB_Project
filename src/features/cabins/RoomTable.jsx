import Spinner from "../../ui/Spinner";
import RoomRow from "./RoomRow";
import { useRooms } from "./useRooms";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

function RoomTable() {
  const { isLoading, rooms } = useRooms();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!rooms.length) return <Empty resourceName="rooms" />;

  // 1) Filter rooms based on the discount query parameter
  const filterValue = searchParams.get("discount") || "all";
  console.log(filterValue);

  let filteredRooms;

  if (filterValue === "all") {
    filteredRooms = rooms;
  }
  if (filterValue === "no-discount") {
    filteredRooms = rooms.filter((room) => room.discount === 0);
  }
  if (filterValue === "with-discount") {
    filteredRooms = rooms.filter((room) => room.discount > 0);
  }

  // 2) Sort rooms based on the sortBy query parameter
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedRooms = filteredRooms.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns=" 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Room</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedRooms}
          render={(room) => <RoomRow room={room} key={room.id} />}
        />
      </Table>
    </Menus>
  );
}

export default RoomTable;