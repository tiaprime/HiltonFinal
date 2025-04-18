//using HiltonFinal.Data;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace HiltonFinal.Controllers
//{
//    [Route("[controller]")]
//    [ApiController]
//    public class EntertainerController : ControllerBase
//    {
//        private EntertainerDbContext _entertainerContext;
//        public EntertainerController(EntertainerDbContext temp) => _entertainerContext = temp;


//        [HttpGet("AllEntertainers")]
//        public IActionResult GetEntertainers()
//        {
//            var list = _entertainerContext.Entertainers
//                .Select(e => new
//                {
//                    e.EntertainerID,
//                    StageName = e.EntStageName   // or e.EntStageName if that’s your property
//                })
//                .ToList();

//            return Ok(list);
//        }


//        [HttpGet("AllEntertainersFull")]
//        public async Task<IActionResult> GetEntertainersFull()
//        {
//            var fullList = await _entertainerContext.Entertainers
//                .Select(e => new
//                {
//                    EntertainerID = e.EntertainerID,
//                    EntStageName = e.EntStageName,
//                    EntSSN = e.EntSSN,
//                    EntStreetAddress = e.EntStreetAddress,
//                    EntCity = e.EntCity,
//                    EntState = e.EntState,
//                    EntZipCode = e.EntZipCode,
//                    EntPhoneNumber = e.EntPhoneNumber,
//                    EntWebPage = e.EntWebPage,
//                    EntEMailAddress = e.EntEMailAddress,
//                    DateEntered = e.DateEntered
//                })
//                .ToListAsync();

//            return Ok(fullList);
//        }


//    }
//}
using System.Linq;
using System.Threading.Tasks;
using HiltonFinal.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HiltonFinal.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly EntertainerDbContext _context;
        public DataController(EntertainerDbContext temp) => _context = temp;

        // ─── Entertainers ──────────────────────────────────────────────────────

        // GET /Data/AllEntertainers
        [HttpGet("AllEntertainers")]
        public IActionResult GetEntertainers()
        {
            var list = _context.Entertainers
                .Select(e => new
                {
                    e.EntertainerID,
                    e.EntStageName
                })
                .ToList();
            return Ok(list);
        }

        // GET /Data/AllEntertainersFull
        [HttpGet("AllEntertainersFull")]
        public async Task<IActionResult> GetEntertainersFull()
        {
            var fullList = await _context.Entertainers
                .Select(e => new
                {
                    e.EntertainerID,
                    e.EntStageName,
                    e.EntSSN,
                    e.EntStreetAddress,
                    e.EntCity,
                    e.EntState,
                    e.EntZipCode,
                    e.EntPhoneNumber,
                    e.EntWebPage,
                    e.EntEMailAddress,
                    e.DateEntered
                })
                .ToListAsync();
            return Ok(fullList);
        }




        // GET /Data/EntertainerInfo/{id}
        // Returns all columns for a single entertainer by ID
        [HttpGet("EntertainerInfo/{id}")]
        public async Task<IActionResult> GetEntertainerInfo(int id)
        {
            var info = await _context.Entertainers
                .Where(e => e.EntertainerID == id)
                .Select(e => new
                {
                    e.EntertainerID,
                    e.EntStageName,
                    e.EntSSN,
                    e.EntStreetAddress,
                    e.EntCity,
                    e.EntState,
                    e.EntZipCode,
                    e.EntPhoneNumber,
                    e.EntWebPage,
                    e.EntEMailAddress,
                    e.DateEntered
                })
                .FirstOrDefaultAsync();

            if (info == null)
                return NotFound(new { Message = $"Entertainer with ID {id} not found." });

            return Ok(info);
        }







        // ─── Engagements ────────────────────────────────────────────────────────

        // GET /Data/AllEngagements
        [HttpGet("AllEngagements")]
        public IActionResult GetEngagements()
        {
            var list = _context.Engagements
                .Select(e => new
                {
                    e.EngagementNumber,
                    e.StartDate
                })
                .ToList();
            return Ok(list);
        }

        // GET /Data/AllEngagementsFull
        [HttpGet("AllEngagementsFull")]
        public async Task<IActionResult> GetEngagementsFull()
        {
            var fullList = await _context.Engagements
                .Select(e => new
                {
                    e.EngagementNumber,
                    e.StartDate,
                    e.EndDate,
                    e.StartTime,
                    e.StopTime,
                    e.ContractPrice,
                    e.CustomerID,
                    e.AgentID,
                    e.EntertainerID
                })
                .ToListAsync();
            return Ok(fullList);
        }



















        [HttpGet("EntertainerBookingStats")]
        public async Task<IActionResult> GetEntertainerBookingStats()
        {
            var stats = await _context.Entertainers
                .GroupJoin(
                    _context.Engagements,
                    ent => ent.EntertainerID,
                    eng => eng.EntertainerID,
                    (ent, engs) => new
                    {
                        
                        EntertainerID = ent.EntertainerID,
                        EntStageName = ent.EntStageName,
                        BookingCount = engs.Count(),
                        LastBookingDate = engs.Any()
                            ? engs.Max(e => e.StartDate)
                            : null
                    }
                )
                .ToListAsync();

            return Ok(stats);
        }









        // GET /EngagementStats/EntertainerBookingStats
        // Returns: { EntertainerID, EntStageName, BookingCount, LastBookingDate }
        //[HttpGet("EntertainerBookingStats")]
        //public async Task<IActionResult> GetEntertainerBookingStats()
        //{
        //    var stats = await _context.Engagements
        //        // 1) Group all bookings by entertainer
        //        .GroupBy(e => e.EntertainerID)
        //        .Select(g => new
        //        {
        //            EntertainerID = g.Key,
        //            BookingCount = g.Count(),
        //            // Uses StartDate; if you want EndDate, swap here
        //            LastBookingDate = g.Max(e => e.StartDate)
        //        })
        //        // 2) Join back to the Entertainers table to pull the stage name
        //        .Join(
        //            _context.Entertainers,
        //            s => s.EntertainerID,
        //            ent => ent.EntertainerID,
        //            (s, ent) => new
        //            {
        //                EntertainerID = s.EntertainerID,
        //                EntStageName = ent.EntStageName,
        //                BookingCount = s.BookingCount,
        //                LastBookingDate = s.LastBookingDate
        //            }
        //        )
        //        .ToListAsync();

        //    return Ok(stats);
        //}



        //---------------------------------------------CRUD STUFF -------------------------------------------

        // POST /Data/AddEntertainer
        [HttpPost("AddEntertainer")]
        public async Task<IActionResult> AddEntertainer([FromBody] Entertainer newEnt)
        {
            if (newEnt == null)
                return BadRequest("Entertainer data is missing.");

            _context.Entertainers.Add(newEnt);
            await _context.SaveChangesAsync();

            // Return the created record
            return Ok(newEnt);
        }



        // DELETE /Data/DeleteEntertainer/{id}
        [HttpDelete("DeleteEntertainer/{id}")]
        public async Task<IActionResult> DeleteEntertainer(int id)
        {
            var ent = await _context.Entertainers.FindAsync(id);
            if (ent == null)
                return NotFound(new { Message = $"Entertainer with ID {id} not found." });

            _context.Entertainers.Remove(ent);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        // PUT /Data/EditEntertainer/{id}
        [HttpPut("EditEntertainer/{id}")]
        public async Task<IActionResult> EditEntertainer(int id, [FromBody] Entertainer updatedEnt)
        {
            if (updatedEnt == null || id != updatedEnt.EntertainerID)
                return BadRequest("Mismatched entertainer data.");

            var existing = await _context.Entertainers.FindAsync(id);
            if (existing == null)
                return NotFound(new { Message = $"Entertainer {id} not found." });

            // copy over each updatable field
            existing.EntStageName = updatedEnt.EntStageName;
            existing.EntSSN = updatedEnt.EntSSN;
            existing.EntStreetAddress = updatedEnt.EntStreetAddress;
            existing.EntCity = updatedEnt.EntCity;
            existing.EntState = updatedEnt.EntState;
            existing.EntZipCode = updatedEnt.EntZipCode;
            existing.EntPhoneNumber = updatedEnt.EntPhoneNumber;
            existing.EntWebPage = updatedEnt.EntWebPage;
            existing.EntEMailAddress = updatedEnt.EntEMailAddress;
            existing.DateEntered = updatedEnt.DateEntered;

            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
